// @flow
import { PureComponent } from 'react'
import AceEditor from 'react-ace-multisession'

import type { KeyboardHandler, Position } from 'types'
import type Page from 'entities/Page'

type Props = {
  url: string,
  body: string,
  keyboardHandler: KeyboardHandler,
  currentPage: ?Page,
  currentPageRangeClassName: string,
  setBody: (body: string) => void,
  setCursor: (pos: Position) => void,
}

type State = {
  body: string,
  currentPageMarkerId: ?number,
  needsClearHistory: boolean,
}

export default class Editor extends PureComponent<void, Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      body: props.body,
      currentPageMarkerId: null,
      needsClearHistory: false,
    }
  }

  // for lint
  props: Props
  state: State
  editorComponent: AceEditor

  componentDidMount () {
    this.selection.on('changeCursor', this.handleCursorChange)
  }

  componentWillUnmount () {
    this.selection.removeAllListeners('changeCursor')
  }

  componentWillReceiveProps ({ url, body, currentPage, currentPageRangeClassName }: Props) {
    if (url !== this.props.url) {
      this.handleChange(body, { needsClearHistory: true })
    }
    if (currentPage != null && currentPage !== this.props.currentPage) {
      const { row: beginRow } = currentPage.beginAt || { row: 1 }
      const endAt = currentPage.endAt || this.endOfFile
      const endRow = endAt.column === 1 ? endAt.row - 1 : endAt.row
      const { id: currentPageMarkerId } = this.editSession.highlightLines(
        beginRow - 1,
        endRow - 1,
        `ace_active-line ${currentPageRangeClassName}`,
      )
      const { currentPageMarkerId: prevPageMarkerId } = this.state
      this.setState({ currentPageMarkerId }, () => {
        if (prevPageMarkerId != null) {
          this.editSession.removeMarker(prevPageMarkerId)
        }
      })
    }
  }

  componentDidUpdate ({ body }: Props) {
    if (this.state.needsClearHistory && this.props.body !== body) {
      setTimeout(() => {
        this.editSession.getUndoManager().reset()
        this.setState({ needsClearHistory: false })
      }, 700)
    }
  }

  get editor (): any {
    return this.editorComponent.editor
  }

  get editSession (): any {
    return this.editor.getSession()
  }

  get selection (): any {
    return this.editSession.getSelection()
  }

  get endOfFile (): Position {
    const row = this.editSession.getLength()
    const column = this.editSession.getLine(row).length
    return { row, column }
  }

  get insertNewpageDirectiveCommand (): Object {
    return {
      Name: 'Insert newpage directive',
      bindKey: {
        win: 'Ctrl-Enter',
        mac: 'Command-Enter',
      },
      exec: (editor) => {
        const { row } = editor.getCursorPosition()
        const lineLength = editor.getSession().getLine(row).length
        const br = `\n${lineLength > 0 ? '\n' : ''}`
        editor.moveCursorTo(row, lineLength)
        editor.insert(`${br}<!-- newpage -->${br}`)
      },
    }
  }

  get commands (): Array<Object> {
    return [
      this.insertNewpageDirectiveCommand,
    ]
  }

  handleChange = (body: string, { needsClearHistory = false }: { needsClearHistory: boolean } = {}) => {
    this.setState({ body, needsClearHistory }, () => {
      this.props.setBody(this.state.body)
    })
  }

  handleCursorChange = (_e: any, selection: any) => {
    const cursor = selection.getCursor()
    cursor.row += 1
    cursor.column += 1
    this.props.setCursor(cursor)
  }

  render () {
    return (
      <AceEditor
        mode='markdown'
        theme='tomorrow'
        keyboardHandler={this.props.keyboardHandler}
        width='100%'
        height='100%'
        value={this.state.body}
        onChange={this.handleChange}
        commands={this.commands}
        ref={(c) => { this.editorComponent = c }}
      />
    )
  }
}
