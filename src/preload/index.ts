import { contextBridge, ipcRenderer } from 'electron'

interface Api {
  sendData: (token: string, url: string, sheetName: string) => void;
  getData: () => Promise<any>;
  openSettings: (callback: () => void) => void;
  getLogsFileSize: () => Promise<number|null>;
  clearLogs: () => Promise<void>;
  sendImgUrl: (url: string) => void;
}

const api: Api = {
  sendData: async (token, url, sheetName) => {
    ipcRenderer.send('send-data', token, url, sheetName);
  },
  getData: () => ipcRenderer.invoke('get-data'),
  openSettings: (callback) => ipcRenderer.on('open-settings', (_event) => callback()),
  getLogsFileSize: () => ipcRenderer.invoke('get-logs-file-size'),
  clearLogs: () => ipcRenderer.invoke('delete-logs'),
  sendImgUrl: (url) => ipcRenderer.send('save-image-url', url)
};

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}

