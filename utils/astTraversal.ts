/**
 * Shared AST traversal helpers for Nuxt Content v3 article bodies.
 *
 * Supports two formats interchangeably:
 *   - minimark (v3 native): `[tag, props, ...children]` where each node is
 *     either a string (text) or a tuple
 *   - legacy MDC: `{ type, tag, value, children }`
 *
 * All helpers tolerate both shapes so callers don't need to branch.
 */

export type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

export interface MdcAstNode {
  type?: string
  tag?: string
  value?: string | MinimarkNode[]
  children?: MdcAstNode[]
  props?: Record<string, unknown>
}

export function isMinimarkTuple(node: unknown): node is [string, Record<string, unknown>, ...MinimarkNode[]] {
  return Array.isArray(node) && node.length >= 2 && typeof node[0] === 'string'
}

/**
 * Recursively gather plain text from any node shape.
 */
export function gatherText(node: unknown): string {
  if (typeof node === 'string')
    return node

  if (isMinimarkTuple(node)) {
    const [, , ...children] = node
    return children.map(gatherText).join('')
  }

  const ast = node as MdcAstNode | undefined
  if (!ast)
    return ''
  if (typeof ast.value === 'string')
    return ast.value
  if (Array.isArray(ast.value))
    return ast.value.map(gatherText).join('')
  if (ast.children && ast.children.length > 0)
    return ast.children.map(gatherText).join('')
  return ''
}

/**
 * Get the immediate children of a node, regardless of format.
 */
export function getNodeChildren(node: unknown): unknown[] {
  if (isMinimarkTuple(node)) {
    const [, , ...children] = node
    return children
  }
  const ast = node as MdcAstNode | undefined
  if (!ast)
    return []
  if (ast.children && ast.children.length > 0)
    return ast.children
  if (Array.isArray(ast.value))
    return ast.value
  return []
}

/**
 * Get the tag of a node, regardless of format.
 */
export function getNodeTag(node: unknown): string | undefined {
  if (isMinimarkTuple(node))
    return node[0]
  const ast = node as MdcAstNode | undefined
  return ast?.tag
}

/**
 * Get the props (HTML attributes) of a node, regardless of format.
 */
export function getNodeProps(node: unknown): Record<string, unknown> {
  if (isMinimarkTuple(node))
    return node[1] || {}
  const ast = node as MdcAstNode | undefined
  return ast?.props || {}
}

/**
 * Normalize a body AST to an array of top-level nodes.
 */
export function topLevelNodes(body: unknown): unknown[] {
  if (!body)
    return []
  if (Array.isArray(body))
    return body
  if (typeof body !== 'object')
    return []
  const obj = body as MdcAstNode
  if (Array.isArray(obj.value))
    return obj.value
  if (obj.children)
    return obj.children
  return []
}

/**
 * Walk the AST depth-first, invoking the visitor on each node.
 * Stops descending if the visitor returns false.
 */
export function walkAst(body: unknown, visit: (node: unknown) => void | false): void {
  const nodes = topLevelNodes(body)
  const stack: unknown[] = [...nodes]
  while (stack.length > 0) {
    const node = stack.shift()
    if (!node || typeof node === 'string')
      continue
    const result = visit(node)
    if (result === false)
      continue
    const children = getNodeChildren(node)
    if (children.length > 0)
      stack.unshift(...children)
  }
}
