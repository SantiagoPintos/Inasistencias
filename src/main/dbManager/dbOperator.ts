import { Database } from 'sqlite3'
import Logger from '../logger/logger'
const logger = new Logger('dbOperator.log')

export const createData = (db: Database): void => {
  const createDataTable = `CREATE TABLE IF NOT EXISTS data (token TEXT NOT NULL, url TEXT NOT NULL, sheetName TEXT NOT NULL, PRIMARY KEY(token))`
  const createImageTable = `CREATE TABLE IF NOT EXISTS image (url TEXT NOT NULL, PRIMARY KEY(url))`
  const createPreferencesTable = `CREATE TABLE IF NOT EXISTS preferences (name TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY(name))`
  try {
    db.run(createDataTable, (err) => {
      if (err) {
        logger.error(`Creating tables: ${err.message}`)
      }
      logger.info('Data table created')
    })
    db.run(createImageTable, (err) => {
      if (err) {
        logger.error(`Creating image table: ${err.message}`)
      }
      logger.info('Image table created')
    })
    db.run(createPreferencesTable, (err) => {
      if (err) {
        logger.error(`Creating preferences table: ${err.message}`)
      }
      logger.info('Preferences table created')
    })
  } catch (err) {
    logger.error((err as Error).message)
  }
}

// Function to check if all of the columns are present in a table, and if not, add them
export const checkColumns = async (
  db: Database,
  tableName: string,
  columns: { name: string; type: string }[]
): Promise<void> => {
  const getColumns = `PRAGMA table_info(${tableName})`
  const addColumn = `ALTER TABLE ${tableName} ADD COLUMN `

  try {
    const rows = await new Promise<{ name: string }[]>((resolve, reject) => {
      db.all(getColumns, [], (err, rows: { name: string }[]) => {
        if (err) {
          logger.error(`Checking columns: ${err.message}`)
          return reject(err)
        }
        resolve(rows)
      })
    })

    const columnNames = rows.map((row) => row.name)

    for (const { name, type } of columns) {
      if (!columnNames.includes(name)) {
        await new Promise<void>((resolve, reject) => {
          db.run(addColumn + `${name} ${type}`, (err) => {
            if (err) {
              logger.error(`Adding column: ${err.message}`)
              return reject(err)
            }
            logger.info(`Column ${name} added`)
            resolve()
          })
        })
      }
    }
  } catch (err) {
    logger.error((err as Error).message)
    throw err
  }
}

export const insertData = async (
  db: Database,
  token: string,
  url: string,
  sheetName
): Promise<void> => {
  const deleteData = `DELETE FROM data`
  const insertData = `INSERT INTO data (token, url, sheetName) VALUES (?, ?, ?)`
  if (token === '' || url === '' || sheetName === '') {
    logger.error('Incomplete data received')
    return
  }
  try {
    db.run(deleteData, (err) => {
      if (err) {
        logger.error(`Inserting data: ${err.message}`)
      }
      logger.info('Data deleted')
    })
    db.run(insertData, [token, url, sheetName], (err) => {
      if (err) {
        logger.error(err.message)
      }
      logger.info('Data inserted')
    })
  } catch (err) {
    logger.error((err as Error).message)
  }
}

export const getTokenAndSheetName = async (
  db: Database
): Promise<{ token: string; sheetId: string; sheetName: string }> => {
  const selectData = `SELECT token, url, sheetName FROM data`

  try {
    return new Promise((resolve, reject) => {
      db.get(selectData, [], (err, row: { token: string; url: string; sheetName: string }) => {
        if (err) {
          logger.error(`Getting data: ${err.message}`)
          reject(err)
        }

        if (row) {
          logger.info('Data selected')
          resolve({ token: row.token, sheetId: row.url, sheetName: row.sheetName })
        } else {
          reject(new Error('Getting data: No data found'))
        }
      })
    })
  } catch (err) {
    logger.error((err as Error).message)
    throw err
  }
}

export const insertImage = async (db: Database, url: string): Promise<void> => {
  const deleteImage = `DELETE FROM image`
  const insertImage = `INSERT INTO image (url) VALUES (?)`
  if (url === '') {
    logger.error('Incomplete data received')
    return
  }
  try {
    db.run(deleteImage, (err) => {
      if (err) {
        logger.error(`Deleting image: ${err.message}`)
      }
      logger.info('Image deleted')
    })
    db.run(insertImage, [url], (err) => {
      if (err) {
        logger.error(`Inserting image: ${err.message}`)
      }
      logger.info('Image inserted')
    })
  } catch (err) {
    logger.error((err as Error).message)
  }
}

export const getImage = async (db: Database): Promise<string | null> => {
  const selectImage = `SELECT url FROM image`

  try {
    return new Promise((resolve, reject) => {
      db.get(selectImage, [], (err, row: { url: string }) => {
        if (err) {
          logger.error(`Getting image: ${err.message}`)
          reject(err)
        }

        if (row) {
          logger.info('Image selected')
          resolve(row.url)
        } else {
          resolve(null)
        }
      })
    })
  } catch (err) {
    logger.error((err as Error).message)
    throw err
  }
}

export const deleteImage = async (db: Database): Promise<void> => {
  const deleteImage = `DELETE FROM image`

  try {
    db.run(deleteImage, (err) => {
      if (err) {
        logger.error(`Deleting image: ${err.message}`)
      }
      logger.log('Image deleted')
    })
  } catch (err) {
    logger.error((err as Error).message)
  }
}

export const deleteAllData = async (db: Database): Promise<void> => {
  const deleteData = `DELETE FROM data`

  try {
    db.run(deleteData, (err) => {
      if (err) {
        logger.error(`Deleting data: ${err.message}`)
      }
      logger.log('Data deleted')
    })
    deleteImage(db)
  } catch (err) {
    logger.error((err as Error).message)
  }
}
