// @flow

export type Position = {
  row: number,
  column: number,
}

export type KeyboardHandler = 'vim' | 'emacs' | null
export type FetchStatus = 'none' | 'loading' | 'loaded' | 'failed'
