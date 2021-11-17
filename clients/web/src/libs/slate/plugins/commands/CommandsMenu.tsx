import React, { memo, useEffect, useRef, useState } from 'react'

import { Editor, Text as TextNode, Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { Box, Divider, Text, useOutsideClick } from '@chakra-ui/react'
import { useKey } from 'react-use'

import groupBy from 'lodash/groupBy'
import last from 'lodash/last'

import { useMatchSorter } from '@/libs/hooks/useMatchSorter'
import { isCollapsed } from '../utils/queries/isCollapsed'
import { ElementPosition, getPositionAtSelection } from '../utils/menuPositions'
import { EditorMenu } from '../utils/EditorMenu'
import { useEditorKeyDownEvent } from '../../core'
import { Command, createNode } from './utils'
import { commands } from './commands'
import { CommandsMenuItem } from './CommandsMenuItem'

/**
 * Positions string to first `/`
 */
const useCommandsMenuPosition = (isOpen: boolean) => {
  const commandMenuRef = useRef()
  const [position, setPosition] = useState<ElementPosition>()

  useEffect(() => {
    const el = commandMenuRef.current
    if (el == null) return
    if (!isOpen) return
    const newPos = getPositionAtSelection(el, {
      direction: 'bottom',
      align: 'left'
    })
    setPosition(newPos)
  }, [commandMenuRef, isOpen])

  return { commandMenuRef, position, setPosition }
}

/**
 * Grabs text after `/` in the editor
 */
const useCommandsMenuQuery = (editor: Editor, onClose?: () => void) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const { selection } = editor
      if (!isCollapsed(selection)) return
      const [node] = Editor.node(editor, selection)
      if (!TextNode.isText(node)) return

      const offset = node.text.lastIndexOf('/')
      if (offset === -1) {
        onClose?.()
        return
      }

      const queryText = Editor.string(editor, {
        ...selection,
        anchor: { ...selection.anchor, offset: offset + 1 }
      })

      if (queryText.match(/\s/g)?.length > 1) {
        onClose?.()
        return
      }

      setQuery(queryText)
    })
  }, [editor, onClose])

  return { query }
}

/**
 * Applies query to commands
 */
const useCommandsMenuFilter = (query: string) => {
  return useMatchSorter(commands, query, {
    keys: ['group', 'desc', 'name']
  })
}

/**
 * Create command menu focus helpers.
 */
const useCommandsMenuFocus = ({
  isOpen,
  query,
  commands,
  createFromCommand
}: {
  isOpen: boolean
  query: string
  onClose?: () => void
  commands: Command[]
  createFromCommand: (command: Command, event: React.SyntheticEvent) => void
}) => {
  const [focusedName, setFocusedName] = useState('')
  useEffect(() => setFocusedName(''), [isOpen, query])

  const getFocusedIndex = () =>
    commands.findIndex(command => command.name === focusedName)

  const setFocusNext = () => {
    const idx = getFocusedIndex()
    setFocusedName(commands[idx + 1]?.name ?? '')
  }
  const setFocusPrevious = () => {
    const idx = getFocusedIndex()
    if (idx === -1) {
      setFocusedName(last(commands)?.name)
      return
    }
    setFocusedName(commands[idx - 1]?.name ?? '')
  }

  useEditorKeyDownEvent(e => {
    if (!isOpen) return
    if (e.key === 'ArrowUp') {
      e.stopPropagation()
      e.preventDefault()
      setFocusPrevious()
    }
    if (e.key === 'ArrowDown') {
      e.stopPropagation()
      e.preventDefault()
      setFocusNext()
    }
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      const command = commands.find(s => s.name === focusedName)
      command && createFromCommand(command, e)
    }
  })

  return { focusedName, setFocusedName }
}

// This is because editor.selection is set to null when the menu appears
let lastSelection = {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [0, 0], offset: 0 }
}

export const CommandsMenu: React.FC<{
  isOpen: boolean
  onClose?(): void
}> = memo(({ isOpen, onClose }) => {
  const editor = useSlate()

  lastSelection = editor.selection != null ? editor.selection : lastSelection

  const { commandMenuRef, position } = useCommandsMenuPosition(isOpen)
  useKey(
    e => e.key === 'Escape',
    () => onClose?.()
  )
  useOutsideClick({ ref: commandMenuRef, handler: () => onClose?.() })

  const { query } = useCommandsMenuQuery(editor, onClose)
  const filteredCommands = useCommandsMenuFilter(query)
  const filteredCommandsGroup = Object.entries(
    groupBy(filteredCommands, c => c.group)
  )

  const createFromCommand = (
    command: Command,
    event?: React.SyntheticEvent
  ) => {
    event?.preventDefault()
    event?.stopPropagation()

    // Get node
    const leaf = Editor.node(editor, lastSelection)
    if (leaf == null) return
    const [node] = leaf
    if (!TextNode.isText(node)) return

    // Delete slash
    Transforms.delete(editor, {
      at: lastSelection,
      distance: 1,
      unit: 'character',
      reverse: true
    })

    // Create node and move selection to new node
    createNode(editor, leaf, command.element)

    onClose?.()
  }

  // Create array from group, since grouping them can cause different order
  const ungroupedFilteredCommands = filteredCommandsGroup
    .map(([, command]) => [...command])
    .flat()
  const { focusedName, setFocusedName } = useCommandsMenuFocus({
    isOpen,
    query,
    commands: ungroupedFilteredCommands,
    createFromCommand
  })

  return (
    <EditorMenu
      ref={commandMenuRef}
      {...position}
      isOpen={isOpen}
      maxHeight={400}
      width={300}
      overflow="auto"
    >
      {filteredCommands.length === 0 && (
        <Text paddingX={2} paddingY={1}>
          No results found.
        </Text>
      )}
      {filteredCommandsGroup.map(([group, commands], idx) => (
        <Box key={group}>
          {idx !== 0 && <Divider marginTop={2} />}
          <Text
            paddingX={2}
            paddingY={1}
            textTransform="uppercase"
            letterSpacing="wide"
            fontSize="sm"
            color="gray.400"
          >
            {group}
          </Text>
          {commands.map(command => (
            <CommandsMenuItem
              key={command.name}
              {...command}
              focusedName={focusedName}
              onClick={e => createFromCommand(command, e)}
              onMouseEnter={() => setFocusedName(command.name)}
              onMouseLeave={() =>
                command.name === focusedName && setFocusedName('')
              }
            />
          ))}
        </Box>
      ))}
    </EditorMenu>
  )
})
