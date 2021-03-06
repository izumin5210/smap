// @flow
import util from 'mdast-util-toc'

import type { Parent } from 'unist'

type Configuration = {
  maxDepth: 1 | 2 | 3 | 4 | 5 | 6,
  heading?: string,
  tight?: boolean,
}

const defaultMaxDepth = 6
const defaultConfig = {
  maxDepth: defaultMaxDepth,
}

export default function (
  {
    maxDepth = defaultMaxDepth,
    ...rest
  }: Configuration = defaultConfig, // eslint-disable-line indent
) {
  const opts = {
    maxDepth,
    ...rest
  }

  return transformer

  function transformer (node: Parent) {
    const result = util(node, opts)
    node.children = [].concat(result.map || [])
  }
}
