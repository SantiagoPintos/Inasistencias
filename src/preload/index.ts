import { contextBridge, ipcRenderer } from 'electron'

interface Api {
  sendData: (token: string, url: string, sheetName: string) => void
  getData: () => Promise<any>
  dataUpdate: (callback: (data: DataFromApi) => void) => void
  openSettings: (callback: () => void) => void
  getLogsFileSize: () => Promise<number | null>
  clearLogs: () => Promise<void>
  sendImgUrl: (url: string) => void
  getImgUrl: () => Promise<string | null>
  deleteImage: () => Promise<boolean>
  deleteAllData: () => Promise<boolean>
}

interface DataFromApi {
  range: string
  majorDimension: string
  values: string[][]
}

const api: Api = {
  sendData: async (token, url, sheetName) => {
    ipcRenderer.send('send-data', token, url, sheetName)
  },
  getData: () => ipcRenderer.invoke('get-data'),
  dataUpdate: (callback) => ipcRenderer.on('data-update', (_event, data) => callback(data)),
  openSettings: (callback) => ipcRenderer.on('open-settings', (_event) => callback()),
  getLogsFileSize: () => ipcRenderer.invoke('get-logs-file-size'),
  clearLogs: () => ipcRenderer.invoke('delete-logs'),
  sendImgUrl: (url) => ipcRenderer.send('save-image-url', url),
  getImgUrl: () => ipcRenderer.invoke('get-image'),
  deleteImage: () => ipcRenderer.invoke('delete-image'),
  deleteAllData: () => ipcRenderer.invoke('delete-all-data')
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}
