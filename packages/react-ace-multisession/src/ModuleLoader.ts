import { KeyboardHandler, Mode, Theme } from './EditorProps'

export default class ModuleLoader {
  private static loadedThemes: Set<string> = new Set()

  constructor () {
  }

  async loadKeyboardHandler (handler: KeyboardHandler) {
    if (handler != null) {
      await this.load(`brace/keybinding/${handler}`)
    }
  }

  async loadMode (mode: Mode) {
    if (mode != null) {
      await this.load(`brace/mode/${mode}`)
    }
  }

  async loadTheme (theme: Theme) {
    if (theme != null) {
      await this.load(`brace/theme/${theme}`)
    }
  }

  private async load(path: string) {
    if (!this.isLoaded(path)) {
      await import(path)
      ModuleLoader.loadedThemes.add(path)
    }
  }

  private isLoaded(path: string): boolean {
    return ModuleLoader.loadedThemes.has(path)
  }
}
