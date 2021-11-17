import { Box, chakra, Text, VisuallyHidden } from '@chakra-ui/react'
import React, { useCallback, useMemo } from 'react'
import { Editable, RenderLeafProps, RenderElementProps } from 'slate-react'
import { useEditorEmitter } from './bus'
import { returnFirstDefined } from './funcs'
import { SlatePlugin } from './plugins'

const ChakraEditable = chakra(Editable)
type ChakraEditableProps = Parameters<typeof ChakraEditable>[0]

export interface EditablePluginsProps extends ChakraEditableProps {
  as?: React.ElementType
  plugins?: SlatePlugin[]
  readOnly?: boolean
}

const usePluginElementRender = (plugins: SlatePlugin[]) => {
  const pluginRenderElements = useMemo(
    () => plugins.map(p => p.renderElement),
    [plugins]
  )
  return useCallback(
    (props: RenderElementProps) => {
      const element = returnFirstDefined([props], pluginRenderElements)
      return (
        element ?? (
          <Box
            {...props.attributes}
            bgColor="red.800"
            rounded="md"
            padding={4}
            contentEditable={false}
          >
            <Text fontWeight="bold">Error</Text>
            Ops... it looks like you are trying to render an element that is not
            valid.
            <code>
              <pre>{JSON.stringify(props.element, null, 4)}</pre>
            </code>
            <VisuallyHidden>{props.children}</VisuallyHidden>
          </Box>
        )
      )
    },
    [pluginRenderElements]
  )
}

const usePluginLeafRender = (plugins: SlatePlugin[]) => {
  const pluginRenderLeafs = useMemo(
    () => plugins.map(p => p.renderLeaf),
    [plugins]
  )
  return useCallback(
    (props: RenderLeafProps) => {
      const element = returnFirstDefined([props], pluginRenderLeafs)
      return element ?? <div {...props.attributes}>Unknown Leaf Default</div>
    },
    [pluginRenderLeafs]
  )
}

export const EditablePlugins: React.FC<EditablePluginsProps> = ({
  plugins,
  readOnly,
  ...editableProps
}) => {
  const renderElement = usePluginElementRender(plugins)
  const renderLeaf = usePluginLeafRender(plugins)

  const editable = (
    <ChakraEditable
      {...editableProps}
      {...useEditorEmitter()}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      readOnly={readOnly}
    />
  )

  const pluginRenders = useMemo(
    () => plugins.filter(p => p.render != null),
    [plugins]
  )
  const callFunc = (currentIdx: number) => {
    if (pluginRenders.length === 0) return editable
    const next = () => {
      const nextIdx = currentIdx + 1
      if (nextIdx == pluginRenders.length) return editable
      return callFunc(nextIdx)
    }
    const plugin = pluginRenders[currentIdx]
    return plugin.render({ children: next(), readOnly })
  }

  return callFunc(0)
}
