import { BrowserWindow, app } from 'electron'
import { databaseConnector } from './../dbManager/dbConnection'
import { getTokenAndSheetName } from './../dbManager/dbOperator'
import Logger from '../logger/logger'
import fs from 'fs'
import path from 'path'
const logger = new Logger()

interface DataFromApi {
  range: string
  majorDimension: string
  values: string[][]
}

export async function fetchData(): Promise<DataFromApi | null> {
  const db = databaseConnector()
  const dataFromDb = await getTokenAndSheetName(db)
  if (dataFromDb.token === undefined || dataFromDb.token === null) {
    logger.error('Token is not set')
    return null
  }
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${dataFromDb.sheetId}/values/${dataFromDb.sheetName}?key=${dataFromDb.token}`
  const response = await fetch(url)
  if (!response.ok) {
    logger.error('Failed to fetch data from google sheets')
    throw new Error('Something went wrong')
  }
  return await response.json()
}

export async function autoFetchData(): Promise<void> {
  const prefsPath = path.join(app.getPath('userData'), 'Prefs', 'prefs.json')
  const preferences = JSON.parse(fs.readFileSync(prefsPath, 'utf-8'))
  let timeInterval = preferences.refreshInterval || 5
  // In case the user enters a random value (negative or something like 60000000000000000000000)
  if (timeInterval < 1 || timeInterval > 60) timeInterval = 5
  // Convert timeInterval from minutes to milliseconds
  const interval = timeInterval * 60000

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
  }, interval)
}
