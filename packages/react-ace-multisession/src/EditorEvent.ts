import * as ace from 'brace'

export type EditorEventName =
  'blur' |
  'change' |
  'changeSelectionStyle' |
  'changeSession' |
  'copy' |
  'focus' |
  'paste'

export type OnBlur = () => void
export type OnChange = (e: ace.EditorChangeEvent) => void
export type OnChangeSelectionStyle = (e: object) => void
export type OnChangeSession = (e: object) => void
export type OnCopy = (text: string) => void
export type OnFocus = () => void
export type OnPaste = (e: object) => void

export interface EditorEventListener {
  onBlur: OnBlur,
  onChange: OnChange,
  onChangeSelectionStyle: OnChangeSelectionStyle,
  onChangeSession: OnChangeSession
  onCopy: OnCopy,
  onFocus: OnFocus,
  onPaste: OnPaste,
}
