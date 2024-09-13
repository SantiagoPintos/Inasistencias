/// <reference types="vite/client" />

declare global {
  interface Window {
    api: {
      sendData: (key: string, url: string, sheetName: string) => Promise<void>
      getData: () => Promise<DataFromApi>
      dataUpdate: (callback: (data: DataFromApi) => void) => void
      openSettings: (callback: () => void) => void
      getLogsFileSize: () => Promise<number | null>
      clearLogs: () => Promise<void>
      sendImgUrl: (url: string) => Promise<void>
      getImgUrl: () => Promise<string | null>
      deleteImage: () => Promise<boolean>
      deleteAllData: () => Promise<boolean>
    }
  }

  interface DataFromApi {
    range: string
    majorDimension: string
    values: string[][]
  }
}

export {}
