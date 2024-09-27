import { app, shell, BrowserWindow, protocol, net, Notification } from 'electron'
import url from 'url'
import { join } from 'path'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { databaseConnector, createDatabaseIfNotExists } from './dbManager/dbConnection'
import { initDatabase } from './dbManager/dbOperator'
import { setMainMenu } from './menu/menu'
import icon from '../../resources/icon.png?asset'
import Logger from './logger/logger'
import { ipcMainEvents } from './ipc/ipc'
import { autoUpdater } from 'electron-updater'
import { setupPreferences } from './preferences/setupPreferences'
import { getLaunchOnStartupStatus } from './preferences/preferencesManager'
import { autoFetchData } from './net/fetchData'

const logger = new Logger('main.log')
createDatabaseIfNotExists()
const db = databaseConnector()
initDatabase(db)

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
      sandbox: true,
      contextIsolation: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    // This is a workaround to set the app name in the window title bar, because the name in
    // package.json could not start with a capital letter according to npm rules.
    mainWindow.setTitle(app.getName().charAt(0).toUpperCase() + app.getName().slice(1))
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
  // Prevent multiple instances of the app
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) app.quit()

  // Setup preferences if they don't exist (first run)
  setupPreferences()

  // Automatically fetch data and notify the renderer
  autoFetchData()

  // Check for updates
  autoUpdater.checkForUpdates()
  // Install updates when the user closes the app
  autoUpdater.on('update-downloaded', (info) => {
    logger.info(`Update downloaded ${autoUpdater.currentVersion.version} -> ${info.version}`)
    new Notification({
      title: 'Una actualización está lista para instalarse',
      body: `La versión ${info.version} ha sido descargada y se instalará automáticamente cuando cierre la aplicación.`
    }).show()
    BrowserWindow.getAllWindows().forEach((win) => {
      win.setTitle('Inasistencias - Actualización pendiente')
    })
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

  // Configure auto launch on startup
  electronApp.setAutoLaunch(getLaunchOnStartupStatus())

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
