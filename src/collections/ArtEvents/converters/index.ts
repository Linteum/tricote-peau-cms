import {
  HTMLConverter,
  SerializedHeadingNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedTextNode,
} from '@payloadcms/richtext-lexical'
import {
  SerializedLexicalNode,
  SerializedParagraphNode,
} from '@payloadcms/richtext-lexical/lexical'

const contentThroughChildren = (node: any) => {
  if (!node.children) return ''
  return node.children.map(recursiveNodeHandler).join('')
}

const recursiveNodeHandler = (node: SerializedLexicalNode): string => {
  //   console.log(node.type)
  if (node.type === 'heading') {
    // return 'tata'
    const seriNode = node as SerializedHeadingNode
    const content = seriNode.children.map(recursiveNodeHandler).join('')
    return `<${seriNode.tag} class="detail-event--subtitle">${content}</${seriNode.tag}>`
  }

  if (node.type === 'paragraph') {
    const seriNode = node as SerializedParagraphNode
    const content = contentThroughChildren(seriNode)
    if (seriNode.children.length == 0) return `</br>`
    return `<p class="detail-event--text">${content}</p>`
  }

  if (node.type === 'list') {
    const seriNode = node as SerializedListNode
    const content = contentThroughChildren(seriNode)
    return `<${seriNode.tag} class="detail-event--list">${content}</${seriNode.tag}>`
  }

  if (node.type === 'listitem') {
    const seriNode = node as SerializedListItemNode
    const content = seriNode.children.map(recursiveNodeHandler).join('')
    return `<li class="detail-event--list--item"">${content}</li>`
  }

  if (node.type === 'link') {
    const seriNode = node as SerializedLinkNode
    const content = contentThroughChildren(seriNode)
    return `<a href="${seriNode.fields.url}" class="detail-event--link" target="_blank">${content}</a>`
  }

  if (node.type === 'text') {
    const seriNode = node as SerializedTextNode
    return seriNode.text
  }

  return ''
}

export const customHTMLConverter: HTMLConverter = {
  converter: async (args) => {
    // Add class names to specific elements
    const node = args.node
    // console.log(node.type)
    if (node.type) return recursiveNodeHandler(node)
    return ''
  },
  nodeTypes: ['list', 'paragraph', 'text', 'heading', 'quote'],
}
