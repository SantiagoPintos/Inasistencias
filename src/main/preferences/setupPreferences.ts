import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import preferences from './../../default-preferences.json'
import Logger from '../logger/logger'

const logger = new Logger()
let prefs = preferences.preferences
export function setupPreferences(): void {
  const prefsPath = path.join(app.getPath('userData'), 'Prefs', 'prefs.json')

  try {
    // Check if the file exists, if not create it
    if (!fs.existsSync(prefsPath)) {
      const directoryPath = path.dirname(prefsPath)
      // Create the directory if it doesn't exist
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true })
      }
      fs.writeFileSync(prefsPath, JSON.stringify(prefs), { flag: 'wx' })
    } else {
        //if the file exists, we need to check if there are the same keys in the file and in the default preferences
        const filePrefs = JSON.parse(fs.readFileSync(prefsPath, 'utf8'))
        const fileKeys = Object.keys(filePrefs)
        const defaultKeys = Object.keys(prefs)
        //if the keys are different, we need to add the missing keys to the file
        if (fileKeys.length !== defaultKeys.length) {
          defaultKeys.forEach((key) => {
            if (!fileKeys.includes(key)) {
              filePrefs[key] = prefs[key]
            }
          })
          fs.writeFileSync(prefsPath, JSON.stringify(filePrefs), { flag: 'w' })
        }
    }
  } catch (err) {
    logger.error('Error writing preferences: ' + (err as Error).message)
  }
}
