// @flow
import * as keys from 'settings/localStorage'

import type { KeyboardHandler } from 'types'

export function getKeyboardHandler (): KeyboardHandler {
  const handler = localStorage.getItem(keys.keyboardHandler)
  if (handler != null) {
    // $FlowFixMe
    return handler
  }
  return null
}

export function setKeyboardHandler (handler: KeyboardHandler) {
  if (handler != null) {
    localStorage.setItem(keys.keyboardHandler, handler)
  } else {
    localStorage.removeItem(keys.keyboardHandler)
  }
}
