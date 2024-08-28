import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  sendData: async (token: string, url: string, sheetName: string) => {
    ipcRenderer.send('send-data', token, url, sheetName)
  },
  getData: () => ipcRenderer.invoke('get-data')
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}

