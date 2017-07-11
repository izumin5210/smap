/* @flow */
import { createAction, handleActions } from 'redux-actions'
import { Record } from 'immutable'

import type { Action } from 'redux-actions'
import type { KeyboardHandler, Position } from 'types'

import wrapStateWith from 'utils/wrapStateWith'

/* ======= Types ======= */

export type EditorStateConfig = {
  cursorPosition: Position,
  keyboardHandler: KeyboardHandler,
}

const defaultValue: EditorStateConfig = {
  cursorPosition: { row: 0, column: 0 },
  keyboardHandler: null,
}

export class EditorState extends Record(defaultValue) {
  // HACK: for typecheck
  // eslint-disable-next-line no-useless-constructor
  constructor (values: $Shape<EditorStateConfig>) {
    super(values)
  }

  // HACK: for typecheck
  cursorPosition: Position
  keyboardHandler: KeyboardHandler

  // HACK: for typecheck
  set: <K: $Keys<EditorStateConfig>>(key: K, value: any) => EditorState;
}

const initialState = new EditorState()

/* ======= Actions ======= */

const MOVE_CURSOR = 'editor:cursorPosition:move'
type MoveCursor = Action<Position, void>
export const moveCursor = createAction(
  MOVE_CURSOR,
  (payload: Position) => payload,
)

const GET_KEYBOARD_HANDLER = 'editor:KeyboardHandler:get'
export const getKeyboardHandler = createAction(GET_KEYBOARD_HANDLER)

const SET_KEYBOARD_HANDLER = 'editor:KeyboardHandler:set'
export type SetKeyboardHandler = Action<KeyboardHandler, void>
export const setKeyboardHandler = createAction(
  SET_KEYBOARD_HANDLER,
  (payload: KeyboardHandler) => payload,
)

/* ======= Reducer ======= */

const reducer = handleActions({
  // HACK: for typecheck
  // [moveCursor.toString()]: (state: EditorState, action: MoveCursor) => {
  [MOVE_CURSOR]: (state: EditorState, action: MoveCursor) => {
    assert(!action.error)
    if (action.error) {
      return state
    }
    const { payload: pos } = action
    assert('row' in pos)
    assert('column' in pos)
    return state.set('cursorPosition', pos)
  },

  // HACK: for typecheck
  // [SetKeyboardHandler.toString()]: (state: EditorState, action: SetKeyboardHandler) => {
  [SET_KEYBOARD_HANDLER]: (state: EditorState, action: SetKeyboardHandler) => {
    assert(!action.error)
    if (action.error) {
      return state
    }
    return state.set('keyboardHandler', action.payload)
  },
}, initialState)

export default wrapStateWith(EditorState, reducer, initialState)
