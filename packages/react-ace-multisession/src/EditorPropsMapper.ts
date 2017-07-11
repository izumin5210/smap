import * as ace from 'brace'
import EditorProps, { KeyboardHandler, Mode, Theme } from './EditorProps'
import ModuleLoader from './ModuleLoader'

export default class EditorPropsMapper implements EditorProps {
  static propNamesForUpdating: (keyof EditorProps)[] = [
    'commands',
  ]

  constructor (
    private editor: ace.Editor,
    private props: EditorProps,
    private loader = new ModuleLoader(),
  ) {
  }

  async initialize () {
    try {
      await this.loader.loadKeyboardHandler(this.props.keyboardHandler)
      this.keyboardHandler = this.props.keyboardHandler
    } catch (e) {
      this.props.keyboardHandler = null
    }
    try {
      await this.loader.loadMode(this.props.mode)
      this.mode = this.props.mode
    } catch (e) {
      this.props.mode = null
    }
    try {
      await this.loader.loadTheme(this.props.theme)
      this.theme = this.props.theme
    } catch (e) {
      this.props.theme = null
    }
    EditorPropsMapper.propNamesForUpdating.forEach((propName) => {
      this[propName] = this.props[propName]
    })
    this.updateValue(this.props.value, this.props.cursorPos)
  }

  async update (nextProps: EditorProps, oldProps: EditorProps = this.props) {
    EditorPropsMapper.propNamesForUpdating.forEach((propName) => {
      if (nextProps[propName] !== oldProps[propName]) {
        this[propName] = nextProps[propName]
      }
    });
    if (nextProps.value !== oldProps.value || nextProps.cursorPos !== oldProps.cursorPos) {
      this.updateValue(nextProps.value, nextProps.cursorPos)
    }
    await this.loadAndUpdate('keyboardHandler', nextProps, oldProps)
    await this.loadAndUpdate('mode', nextProps, oldProps)
    await this.loadAndUpdate('theme', nextProps, oldProps)
  }

  get keyboardHandler (): KeyboardHandler {
    return this.props.keyboardHandler
  }

  set keyboardHandler (handler: KeyboardHandler) {
    // FIXME: Editor#setKeyboardHandler seems to be able to receive null
    // ref: https://github.com/ajaxorg/ace/blob/255c3a1793276b77eeba90e40df99c3ccc941780/lib/ace/editor.js#L240-L259
    (<any> this.editor).setKeyboardHandler(handler != null ? `ace/keyboard/${handler}` : null)
    this.props.keyboardHandler = handler
  }

  get mode (): Mode {
    return this.props.mode
  }

  set mode (mode: Mode) {
    // FIXME: EditSessoin#setMdoe seems to be able to receive null
    // ref: https://github.com/ajaxorg/ace/blob/255c3a1793276b77eeba90e40df99c3ccc941780/lib/ace/edit_session.js#L869-L917
    (<any> this.editor.getSession()).setMode(mode != null ? `ace/mode/${mode}` : null)
    this.props.mode = mode
  }

  get theme (): Theme {
    return this.props.theme
  }

  set theme (theme: Theme) {
    // FIXME: Editor#setTheme seems to be able to receive null
    // ref: https://github.com/ajaxorg/ace/blob/255c3a1793276b77eeba90e40df99c3ccc941780/lib/ace/virtual_renderer.js#L1515-L1568
    (<any> this.editor).setTheme(theme != null ? `ace/theme/${theme}` : null)
    this.props.theme = theme
  }

  get commands (): ace.EditorCommand[] {
    return this.commands
  }

  set commands (commands: ace.EditorCommand[]) {
    this.editor.commands.addCommands(commands)
    this.props.commands = commands
  }

  get cursorPos(): number {
    return this.props.cursorPos || 1
  }

  set cursorPos (cursorPos: number) {
    this.updateValue(this.value, cursorPos)
    this.props.cursorPos = cursorPos
  }

  get value (): string {
    return this.props.value
  }

  set value (value: string) {
    this.updateValue(value, this.cursorPos)
    this.props.value = value
  }

  private updateValue (value: string = this.value, cursorPos: number = this.cursorPos) {
    // FIXME: Should add Sessionn#toJSON() to the type definition of ace.js
    const pos = (<any> this.editor.session.selection).toJSON()
    // FIXME: Thrown syntax error if a semicolon in the following line is removed...
    this.editor.setValue(value, cursorPos);
    (<any> this.editor.session.selection).fromJSON(pos)
  }

  private async loadAndUpdate (
    key: 'keyboardHandler' | 'mode' | 'theme',
    nextProps: EditorProps,
    oldProps: Partial<EditorProps>,
  ) {
    if (!(key in oldProps) || nextProps[key] != oldProps[key]) {
      try {
        switch (key) {
          case 'keyboardHandler':
            await this.loader.loadKeyboardHandler(nextProps.keyboardHandler)
            break
          case 'mode':
            await this.loader.loadMode(nextProps.mode)
            break
          case 'theme':
            await this.loader.loadTheme(nextProps.theme)
            break
          default:
            throw new Error(`Unknown key: ${key}`)
        }
        this[key] = nextProps[key]
      } catch (e) {
      }
    }
  }
}
