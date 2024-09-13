import { ipcMain } from 'electron'
import { databaseConnector } from '../dbManager/dbConnection'
import {
  insertData,
  insertImage,
  getImage,
  deleteImage,
  deleteAllData
} from '../dbManager/dbOperator'
import { getLogsFileSize, clearLogs } from './../logger/loggerManager'
import { saveImage } from './../imgManager/imgManager'
import Logger from '../logger/logger'
import { fetchData } from '../net/fetchData'

const logger = new Logger()

export const ipcMainEvents = () => {
  ipcMain.on('send-data', async (_, token: string, id: string, sheetName: string) => {
    try {
      logger.log(`Data received in main`)
      if (id === null) throw new Error('Something went wrong')
      const db = databaseConnector()
      await insertData(db, token, id, sheetName)
    } catch (err) {
      logger.error('Error saving the token: ' + (err as Error).message)
      console.log(err)
    }
  })

  ipcMain.handle('get-data', async () => {
    try {
      return await fetchData()
    } catch (err) {
      logger.error('Error getting the token: ' + (err as Error).message)
      console.log(err)
      return null
    }
  })

  ipcMain.handle('get-logs-file-size', async () => {
    try {
      logger.log(`Logs file size requested in main`)
      return await getLogsFileSize()
    } catch (err) {
      logger.error('Error getting the logs file size: ' + (err as Error).message)
      console.log(err)
      return null
    }
  })

  ipcMain.handle('delete-logs', async () => {
    try {
      logger.log(`Logs deleted in main`)
      return await clearLogs()
    } catch (err) {
      logger.error('Error deleting the logs: ' + (err as Error).message)
      console.log(err)
      return null
    }
  })

  ipcMain.on('save-image-url', async (_, url: string) => {
    try {
      logger.log(`Image url received in main`)
      const db = databaseConnector()
      const imgPath = await saveImage(url)
      await insertImage(db, imgPath)
    } catch (err) {
      logger.error('Error saving the image url: ' + (err as Error).message)
      console.log(err)
    }
  })

  ipcMain.handle('get-image', async () => {
    try {
      logger.log(`Image requested in main`)
      const db = databaseConnector()
      return await getImage(db)
    } catch (err) {
      logger.error('Error getting the image: ' + (err as Error).message)
      console.log(err)
      return null
    }
  })

  ipcMain.handle('delete-image', async () => {
    try {
      logger.log(`Image deleted in main`)
      const db = databaseConnector()
      await deleteImage(db)
      return true
    } catch (err) {
      logger.error('Error deleting the image: ' + (err as Error).message)
      console.log(err)
      return false
    }
  })

  ipcMain.handle('delete-all-data', async () => {
    try {
      const db = databaseConnector()
      await deleteAllData(db)
      return true
    } catch (err) {
      logger.error('Error deleting the data: ' + (err as Error).message)
      console.log(err)
      return false
    }
  })
}
