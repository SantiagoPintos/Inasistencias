import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import Logger from '../logger/logger'

const logger = new Logger()

export const setLaunchOnSartup = (value: boolean) => {
  const prefsPath = path.join(app.getPath('userData'), 'Prefs', 'prefs.json')
  const preferences = JSON.parse(fs.readFileSync(prefsPath, 'utf-8'))
  preferences.autoLaunchOnStart = value
  try {
    fs.writeFileSync(prefsPath, JSON.stringify(preferences), { flag: 'w' })
    return value
  } catch (err) {
    logger.error('Error writing preferences: ' + (err as Error).message)
    return null
  }
}

export const getLaunchOnStartupStatus = (): boolean => {
  const prefsPath = path.join(app.getPath('userData'), 'Prefs', 'prefs.json')
  const preferences = JSON.parse(fs.readFileSync(prefsPath, 'utf-8'))
  return preferences.autoLaunchOnStart
}
