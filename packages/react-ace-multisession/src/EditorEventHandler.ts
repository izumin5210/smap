import * as ace from 'brace'
import { EditorEventName, EditorEventListener } from './EditorEvent'

export type Listener = Partial<EditorEventListener>

const mapEventNameToCallbackNames: { [key in EditorEventName]: keyof EditorEventListener } = {
  blur: 'onBlur',
  change: 'onChange',
  changeSelectionStyle: 'onChangeSelectionStyle',
  changeSession: 'onChangeSession',
  copy: 'onCopy',
  focus: 'onFocus',
  paste: 'onPaste',
}

export default class EditorEventHandler implements EditorEventListener {
  constructor (listener: Listener) {
    this.listener = listener
    this.silent = false
  }

  silent: boolean
  private listener: Listener

  onBlur = () => {
    if (this.listener.onBlur != null && !this.isSilent()) {
      this.listener.onBlur()
    }
  }

  onChange = (e: ace.EditorChangeEvent) => {
    if (this.listener.onChange != null && !this.isSilent()) {
      this.listener.onChange(e)
    }
  }

  onChangeSelectionStyle = (e: object) => {
    if (this.listener.onChangeSelectionStyle != null && !this.isSilent()) {
      this.listener.onChangeSelectionStyle(e)
    }
  }

  onChangeSession = (e: object) => {
    if (this.listener.onChangeSession != null && !this.isSilent()) {
      this.listener.onChangeSession(e)
    }
  }

  onCopy = (text: string) => {
    if (this.listener.onCopy != null && !this.isSilent()) {
      this.listener.onCopy(text)
    }
  }

  onFocus = () => {
    if (this.listener.onFocus != null && !this.isSilent()) {
      this.listener.onFocus()
    }
  }

  onPaste = (e: object) => {
    if (this.listener.onPaste != null && !this.isSilent()) {
      this.listener.onPaste(e)
    }
  }

  register (editor: ace.Editor) {
    Object.keys(mapEventNameToCallbackNames).forEach((name: EditorEventName) => {
      editor.on(name, this[mapEventNameToCallbackNames[name]])
    })
  }

  unregister (editor: ace.Editor) {
    Object.keys(mapEventNameToCallbackNames).forEach((name: EditorEventName) => {
      // FIXME:
      (<any> editor).off(name, this[mapEventNameToCallbackNames[name]])
    })
  }

  updateListener (listener: Listener) {
    this.listener = listener
  }

  enableSilent (silent: boolean) {
    this.silent = silent
  }

  private isSilent (): boolean {
    return this.silent
  }
}
