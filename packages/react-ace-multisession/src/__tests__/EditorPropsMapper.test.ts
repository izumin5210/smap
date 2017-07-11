import * as ace from 'brace'
import EditorProps from '../EditorProps'
import EditorPropsMapper from '../EditorPropsMapper'
import ModuleLoader from '../ModuleLoader'

const MockLoader = jest.fn<ModuleLoader>(() => ({
  loadKeyboardHandler: jest.fn(),
  loadMode: jest.fn(),
  loadTheme: jest.fn(),
}))

const MockSelection = jest.fn<ace.Selection>(() => ({
  toJSON: jest.fn(),
  fromJSON: jest.fn(),
}))

const MockSession = jest.fn<ace.IEditSession>((selection: ace.Selection = new MockSelection()) => ({
  setMode: jest.fn(),
  selection: selection,
  getSelection () {
    return selection
  },
}))

const MockCommandManager = jest.fn<ace.CommandManager>(() => ({
  addCommand: jest.fn(),
  addCommands: jest.fn(),
  removeCommand: jest.fn(),
  removeCommands: jest.fn(),
}))

const MockEditor = jest.fn<ace.Editor>((
  session: ace.IEditSession = new MockSession(),
  commands: ace.CommandManager = new MockCommandManager(),
) => ({
  setKeyboardHandler: jest.fn(),
  setTheme: jest.fn(),
  setValue: jest.fn(),
  session,
  commands,
  getSession () {
    return session
  },
}))

let loader: ModuleLoader
let editor: ace.Editor

function createMapper (props: EditorProps) {
  return new EditorPropsMapper(editor, props, loader)
}

beforeEach(() => {
  loader = new MockLoader()
  editor = new MockEditor()
})

describe('#initialize()', () => {
  it('empty props', async () => {
    const mapper = createMapper({ value: 'foobar' })
    await mapper.initialize()

    expect(editor.setKeyboardHandler).toBeCalledWith(null)
    expect(editor.session.setMode).toBeCalledWith(null)
    expect(editor.setTheme).toBeCalledWith(null)
    // expect(editor.commands.addCommands).toBeCalledWith([])
    expect(editor.setValue).toBeCalledWith('foobar', 1)
  })

  it('with theme', async () => {
    const mapper = createMapper({ value: 'foobar', theme: 'tomorrow' })
    await mapper.initialize()

    expect(editor.setTheme).toBeCalledWith('ace/theme/tomorrow')
    expect(loader.loadTheme).toBeCalledWith('tomorrow')
  })

  it('with markdown', async () => {
    const mapper = createMapper({ value: 'foobar', mode: 'markdown' })
    await mapper.initialize()

    expect(editor.session.setMode).toBeCalledWith('ace/mode/markdown')
    expect(loader.loadMode).toBeCalledWith('markdown')
  })

  it('with keyboardHandler', async () => {
    const mapper = createMapper({ value: 'foobar', keyboardHandler: 'vim' })
    await mapper.initialize()

    expect(editor.setKeyboardHandler).toBeCalledWith('ace/keyboard/vim')
    expect(loader.loadKeyboardHandler).toBeCalledWith('vim')
  })
})

describe('#update()', () => {
  let mapper: EditorPropsMapper

  const initialize = async (oldProps: EditorProps, nextProps: EditorProps) => {
    mapper = createMapper(oldProps)
    await mapper.initialize()
    await mapper.update(nextProps)
  }

  describe('keyboardHandler', () => {
    it('changes from null to vim', async () => {
      await initialize(
        { value: 'foobar', keyboardHandler: null },
        { value: 'foobar', keyboardHandler: 'vim' },
      )

      expect(editor.setKeyboardHandler.mock.calls[1][0]).toEqual('ace/keyboard/vim')
      expect(loader.loadKeyboardHandler.mock.calls[1][0]).toEqual('vim')
    })

    it('changes from vim to null', async () => {
      await initialize(
        { value: 'foobar', keyboardHandler: 'vim' },
        { value: 'foobar', keyboardHandler: null },
      )

      expect(editor.setKeyboardHandler.mock.calls[1][0]).toEqual(null)
      expect(loader.loadKeyboardHandler.mock.calls[1][0]).toEqual(null)
    })

    it('does not change keyboardHandler', async () => {
      await initialize(
        { value: 'foobar', keyboardHandler: 'vim' },
        { value: 'foobar', keyboardHandler: 'vim' },
      )

      expect(editor.setKeyboardHandler.mock.calls.length).toEqual(1)
      expect(loader.loadKeyboardHandler.mock.calls.length).toEqual(1)
    })
  })

  describe('mode', () => {
    it('changes from null to markdown', async () => {
      await initialize(
        { value: 'foobar', mode: null },
        { value: 'foobar', mode: 'markdown' },
      )

      expect(editor.session.setMode.mock.calls[1][0]).toEqual('ace/mode/markdown')
      expect(loader.loadMode.mock.calls[1][0]).toEqual('markdown')
    })

    it('changes from markdown to null', async () => {
      await initialize(
        { value: 'foobar', mode: 'markdown' },
        { value: 'foobar', mode: null },
      )

      expect(editor.session.setMode.mock.calls[1][0]).toEqual(null)
      expect(loader.loadMode.mock.calls[1][0]).toEqual(null)
    })

    it('does not change', async () => {
      await initialize(
        { value: 'foobar', mode: 'markdown' },
        { value: 'foobar', mode: 'markdown' },
      )

      expect(editor.session.setMode.mock.calls.length).toEqual(1)
      expect(loader.loadMode.mock.calls.length).toEqual(1)
    })
  })

  describe('theme', () => {
    it('changes from null to tomorrow', async () => {
      await initialize(
        { value: 'foobar', theme: null },
        { value: 'foobar', theme: 'tomorrow' },
      )

      expect(editor.setTheme.mock.calls[1][0]).toEqual('ace/theme/tomorrow')
      expect(loader.loadTheme.mock.calls[1][0]).toEqual('tomorrow')
    })

    it('changes from markdown to null', async () => {
      await initialize(
        { value: 'foobar', theme: 'tomorrow' },
        { value: 'foobar', theme: null },
      )

      expect(editor.setTheme.mock.calls[1][0]).toEqual(null)
      expect(loader.loadTheme.mock.calls[1][0]).toEqual(null)
    })

    it('does not change', async () => {
      await initialize(
        { value: 'foobar', theme: 'tomorrow' },
        { value: 'foobar', theme: 'tomorrow' },
      )

      expect(editor.setTheme.mock.calls.length).toEqual(1)
      expect(loader.loadTheme.mock.calls.length).toEqual(1)
    })
  })

  describe('commands', () => {
    it('adds a new command', async () => {
      const newExec = () => {}
      await initialize(
        { value: 'foobar', commands: [] },
        { value: 'foobar', commands: [{ name: 'test', bindKey: {}, exec: newExec }] },
      )
      expect(editor.commands.addCommands.mock.calls[1][0][0])
        .toMatchObject({ name: 'test', bindKey: {}, exec: newExec })
    })

    it('modifies an existing command', async () => {
      const newExec = () => { console.log('baz') }
      await initialize(
        { value: 'foobar', commands: [{ name: 'test', bindKey: {}, exec: () => {} }] },
        { value: 'foobar', commands: [{ name: 'test', bindKey: {}, exec: newExec }] },
      )
      expect(editor.commands.addCommands.mock.calls[1][0][0])
        .toMatchObject({ name: 'test', bindKey: {}, exec: newExec })
    })

    xit('removes an existing command', async () => {
      await initialize(
        { value: 'foobar', commands: [{ name: 'test', bindKey: {}, exec: () => {} }] },
        { value: 'foobar', commands: [] },
      )
      expect(editor.commands.removeCommand.mock.calls[0][0]).toEqual('test')
    })

    xit('does not change', async () => {
      const exec = () => {}
      await initialize(
        { value: 'foobar', commands: [{ name: 'test', bindKey: {}, exec }] },
        { value: 'foobar', commands: [{ name: 'test', bindKey: {}, exec }] },
      )
      expect(editor.commands.addCommands.mock.calls.length).toEqual(1)
    })
  })

  describe('value', () => {
    it('changes', async () => {
      await initialize({ value: 'foobar' }, { value: 'baz' })
      expect(editor.setValue).toBeCalledWith('baz', 1)
    })

    it('does not change', async () => {
      await initialize({ value: 'foobar' }, { value: 'foobar' })
      expect(editor.setValue.mock.calls.length).toEqual(1)
    })
  })
})
