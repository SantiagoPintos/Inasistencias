/// <reference types="vite/client" />

declare global {
    interface Window {
      api: {
        sendData: (key: string, url: string, sheetName: string) => Promise<void>;
        getData: () => Promise<Object>;
      };
    }
}

export {}
