import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  sendToken: async (token: string) => {
    ipcRenderer.send('send-token', token)
  },
  getData: () => ipcRenderer.invoke('get-data')
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}

