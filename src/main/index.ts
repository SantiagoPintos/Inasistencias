import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { databaseConnector, createDatabaseIfNotExists } from './dbManager/dbConnection'
import { createData, insertData, getTokenAndSheetName } from './dbManager/dbOperator'
import icon from '../../resources/icon.png?asset'
import Logger from './logger/logger'

const logger = new Logger('main.log');
createDatabaseIfNotExists()
const db = databaseConnector()
createData(db)

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  logger.log('Window created')

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.isbo.inasistencias')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('send-data', async (_, token: string, id: string, sheetName: string) => {
    try{
      logger.log(`Data received in main`)
      if(id === null) throw new Error('Something went wrong')
      const db = databaseConnector()
      await insertData(db, token, id, sheetName)
    } catch (err) {
      logger.error('Error saving the token: '+(err as Error).message)
      console.log(err)
    }
  })

  ipcMain.handle('get-data', async () => {
    try{
      logger.log(`Data requested in main`)
      const db = databaseConnector()
      const dataFromDb = await getTokenAndSheetName(db)
      if(!dataFromDb) return null
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${dataFromDb.sheetId}/values/${dataFromDb.sheetName}?key=${dataFromDb.token}`
      const response = await fetch(url)
      if(!response.ok) {
        logger.error('Error getting the data: '+response.statusText)
        return null
      }
      logger.log('Data received from the sheet')
      const data = await response.json()
      return data
    } catch (err) {
      logger.error('Error getting the token: '+(err as Error).message)
      console.log(err)
      return null
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
