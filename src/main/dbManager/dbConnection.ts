import * as sqlite3 from 'sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import Logger from '../../logger/logger';

export const databasePath = path.join(app.getPath("userData"), 'database', 'database.sqlite');
const logger = new Logger('dbConnection.log');
let db: sqlite3.Database;

export function createDatabaseIfNotExists() {
  if (!fs.existsSync(databasePath)) {
    try{
      const directoryPath = path.dirname(databasePath);
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }
      fs.writeFileSync(databasePath, '');
    } catch (err: any) {
      logger.log('Error al crear la base de datos: ' + err.message);
      throw new Error('Error al crear db');
    }
  }
}

export function databaseConnector() {
  db = new sqlite3.Database(databasePath, (err: Error | null) => {
    if (err) {
      logger.log('Error al conectar a la base de datos: ' + err.message);
      throw new Error(err.message);
    }
  });

  return db;
}

export function closeConnection(){
    if(db!==null){
        db.close((err: Error|null) => {
            if (err) {
              logger.log('Error al cerrar la conexión con la base de datos: ' + err.message);
              throw new Error(err.message);
            }
        })
    }
}