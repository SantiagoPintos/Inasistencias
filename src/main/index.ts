import { app, shell, BrowserWindow, protocol, net, Notification } from 'electron'
import url from 'url'
import { join } from 'path'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { databaseConnector, createDatabaseIfNotExists } from './dbManager/dbConnection'
import { createData } from './dbManager/dbOperator'
import { setMainMenu } from './menu/menu'
import icon from '../../resources/icon.png?asset'
import Logger from './logger/logger'
import { ipcMainEvents } from './ipc/ipc'
import { fetchData } from './net/fetchData'
import { autoUpdater } from 'electron-updater'

const logger = new Logger('main.log')
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

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
    setMainMenu()
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
  //fetch data from google sheets every 5 minutes and notify the renderer
  setInterval(async () => {
    try {
      const data = await fetchData()
      if (data) {
        BrowserWindow.getAllWindows().forEach((win) => {
          win.webContents.send('data-update', data)
        })
      }
    } catch (err) {
      logger.error('Error fetching data: ' + (err as Error).message)
    }
  }, 300000)


  // Check for updates
  autoUpdater.checkForUpdates()
  // Install updates when the user closes the app
  autoUpdater.on('update-downloaded', (info) => {
    logger.info(`Update downloaded ${autoUpdater.currentVersion.version} -> ${info.version}`)
    new Notification({
      title: 'Una actualización está lista para instalarse',
      body: `La versión ${info.version} ha sido descargada y se instalará automáticamente cuando cierre la aplicación.`
    }).show()
  })
  

  // Register the 'inasistencias' protocol
  protocol.handle('inasistencias', (req) => {
    const filePath = req.url.replace('inasistencias://', '')
    const fullFilePath = path.join(app.getPath('userData'), 'LocalImages', filePath)
    return net.fetch(url.pathToFileURL(fullFilePath).toString())
  })

  ipcMainEvents()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.santiago.inasistencias')

  // Set auto launch on startup
  electronApp.setAutoLaunch(true)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
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
