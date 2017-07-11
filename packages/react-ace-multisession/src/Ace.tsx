import * as ace from 'brace'
import * as React from 'react'

import EditorPropsMapper from './EditorPropsMapper'
import EditorEventHandler from './EditorEventHandler'
import EditorProps from './EditorProps'
import { EditorEventListener } from './EditorEvent'

export type RequiredProps = Partial<EditorProps> & Partial<EditorEventListener> & {
  id?: string,
  value: string,
  width: number | string,
  height: number | string,
  style: Object,
}

export type DefaultProps = {
  id: string,
  cursorPos: EditorProps['cursorPos'],
  commands: EditorProps['commands'],
}

export type Props = RequiredProps & DefaultProps & EditorProps

export interface State {
}

export default class Ace extends React.PureComponent<RequiredProps, State> {
  public static defaultProps: DefaultProps = {
    id: 'ace-multisession',
    cursorPos: 1,
    commands: [],
  }

  editor: ace.Editor
  editorRef: HTMLElement
  private mapper: EditorPropsMapper
  private handler: EditorEventHandler

  componentDidMount () {
    const { id } = this.props as Props
    this.editor = ace.edit(id)
    this.mapper = new EditorPropsMapper(this.editor, this.props)
    this.handler = new EditorEventHandler(this.props)
    this.mapper.initialize()
    this.handler.register(this.editor)
  }

  componentWillUnmount () {
    this.handler.unregister(this.editor)
  }

  componentWillReceiveProps (nextProps: Readonly<RequiredProps>) {
    this.handler.enableSilent(true)
    this.mapper.update(nextProps)
    this.handler.updateListener(nextProps)
    this.handler.enableSilent(false)
  }

  get style (): Object {
    const { width, height, style } = this.props
    return {
      ...style,
      width,
      height,
    }
  }

  render () {
    const { id } = this.props
    return (
      <div
        id={id}
        style={this.style}
        ref={(ref: HTMLDivElement) => { this.editorRef = ref }}
      />
    )
  }
}
