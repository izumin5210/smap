import * as ace from 'brace'
import ModuleLoader from '../ModuleLoader'

(<any> global).ace = ace

let loader: ModuleLoader

beforeEach(() => {
  loader = new ModuleLoader()
})

afterEach(() => {
  (<any> ModuleLoader).loadedThemes = new Set()
})

test('loadKeyboardHandler', async () => {
  ['vim', null, 'emacs', 'vim'].forEach(async n => (
    await expect(loader.loadKeyboardHandler(n)).resolves.toBeUndefined()
  ))
  await expect(loader.loadKeyboardHandler('')).rejects.toBeDefined()
  await expect(loader.loadKeyboardHandler('atom')).rejects.toBeDefined()
})

test('loadMode', async () => {
  ['text', null, 'markdown', 'text'].forEach(async n => (
    await expect(loader.loadMode(n)).resolves.toBeUndefined()
  ))
  await expect(loader.loadMode('')).rejects.toBeDefined()
  await expect(loader.loadMode('atom')).rejects.toBeDefined()
})

test('loadTheme', async () => {
  ['tomorrow', null, 'textmate', 'tomorrow'].forEach(async n => (
    await expect(loader.loadTheme(n)).resolves.toBeUndefined()
  ))
  await expect(loader.loadMode('')).rejects.toBeDefined()
  await expect(loader.loadMode('hybrid')).rejects.toBeDefined()
})
