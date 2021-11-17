import { IconType } from 'react-icons/lib'
import { Transforms, Node, Element as SlateElement, Editor, NodeEntry } from 'slate'

export type Command = {
  element?: Partial<SlateElement>
  group: string
  icon: IconType
  name: string
  desc: string
}

export const createNode = (editor: Editor, createBelow:NodeEntry<Node>, node: any) => {
  const [, createBelowPath] = createBelow
  const insertionPoint = Editor.end(editor,createBelowPath)
  const newNode:SlateElement = {...node,children: []}
  Transforms.insertNodes(editor,newNode,{at:insertionPoint})

  // Move selection to the new node
  Transforms.select(editor,{
    path:[insertionPoint.path[0]+1,0],
    offset:0
  })
}
