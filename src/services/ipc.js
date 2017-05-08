// @flow
import { ipcRenderer as ipc } from 'electron'

import * as channels from 'settings/ipc'
import Document from 'entities/Document'

export function save (doc: Document) {
  ipc.send(channels.entities.document.save, doc.toJS())
}

export function startExportingAsPdf () {
  ipc.send(channels.exportAsPdf.start)
}
