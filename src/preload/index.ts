import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  sendToken: async (token: string, url: string) => {
    ipcRenderer.send('send-data', token, url)
  },
  getData: () => ipcRenderer.invoke('get-data')
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}

