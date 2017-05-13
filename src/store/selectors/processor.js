// @flow
import { createSelector } from 'reselect'
import remark from 'remark'
import remarkRenderer from 'remark-react'
import remarkYamlMeta from 'remark-yaml-meta'
import remarkOutline from 'utils/remark-outline'
import remarkExtractStyles from 'utils/remark-extract-styles'
import remarkNewpageDirective, {
  handlers as newpageDirectiveHandlers
} from 'utils/remark-newpage-directive'
import remarkPagePropsDirective from 'utils/remark-page-props-directive'
import githubSanitize from 'hast-util-sanitize/lib/github'
import mergeWith from 'lodash/mergeWith'
import isArray from 'lodash/isArray'

import SlideContainer from 'containers/SlideContainer'
import { Image } from 'components/preview'

import { getBody as getRawBody } from './entities/document'

const sanitize = mergeWith(
  {},
  githubSanitize,
  {
    tagNames: [
      'page',
    ],
    attributes: {
      page: ['className'],
    }
  },
  (obj, src) => {
    if (isArray(obj) && isArray(src)) {
      return [].concat(obj, src)
    }
  }
)

const handlers = Object.assign({}, newpageDirectiveHandlers)
const toHast = { handlers }
const remarkReactComponents = { page: SlideContainer, img: Image }
const rendererOptions = { sanitize, toHast, remarkReactComponents }

const outlineProcessor = remark().use(remarkOutline).use(remarkRenderer)

const bodyProcessor = remark()
  .use(remarkYamlMeta)
  .use(remarkNewpageDirective, { tagName: 'page' })
  .use(remarkPagePropsDirective)
  .use(remarkExtractStyles)
  .use(remarkRenderer, rendererOptions)

export const getBodyAst = createSelector(
  getRawBody,
  (body: string) => bodyProcessor.processSync(body),
)

export const getOutlineAst = createSelector(
  getRawBody,
  (body: string) => outlineProcessor.processSync(body),
)

export const getBodyElement = createSelector(
  getBodyAst,
  ({ contents }: any) => contents,
)

export const getOutlineElement = createSelector(
  getOutlineAst,
  ({ contents }: any) => contents,
)

export const getBaseFontSize = createSelector(
  getBodyAst,
  ({ meta }: any) => meta && meta.fontSize,
)
