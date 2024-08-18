/// <reference types="vite/client" />

declare global {
    interface Window {
      api: {
        sendToken: (value: string) => Promise<void>;
      };
    }
}

export {}
