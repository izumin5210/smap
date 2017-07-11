import * as ace from 'brace'

export type KeyboardHandler = string | undefined | null
export type Mode = string | undefined | null
export type Theme = string | undefined | null

export interface RequiredProps {
  value: string,
}

export interface OptionalProps {
  keyboardHandler: KeyboardHandler,
  mode: Mode,
  theme: Theme,
  cursorPos: number,
  commands: ace.EditorCommand[],
}

interface EditorProps extends RequiredProps, Partial<OptionalProps> {
}

export default EditorProps
