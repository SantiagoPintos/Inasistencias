import { Database } from 'sqlite3';
import Logger from '../logger/logger';
const logger = new Logger('dbOperator.log');


export const createData = (db: Database): void => {
    const createDataTable = `CREATE TABLE IF NOT EXISTS data (token TEXT NOT NULL, url TEXT NOT NULL, PRIMARY KEY(token))`;
    try {
        db.run(createDataTable, (err) => {
            if(err){
                logger.error(err.message);
            }
            logger.info('Data table created');
        });
    } catch (err) {
        logger.error((err as Error).message);
    } 
}

export const insertData = async (db: Database, token: string, url: string): Promise<void> => {
    const deleteData = `DELETE FROM data`;
    const insertData = `INSERT INTO data (token, url) VALUES (?, ?)`;
    if(token === '' || url === ''){
        logger.error('Data or url is empty');
        return;
    }
    try {
        db.run(deleteData, (err) => {
            if(err){
                logger.error(err.message);
            }
            logger.info('Data deleted');
        });
        db.run(insertData, [token, url], (err) => {
            if(err){
                logger.error(err.message);
            }
            logger.info('Data inserted');
        });
    } catch (err) {
        logger.error((err as Error).message);
    }
}

export const getToken = async (db: Database): Promise<string> => {
    const selectData = `SELECT token FROM data`;
    return new Promise((resolve, reject) => {
        db.get(selectData, (err, row: string) => {
            if(err){
                logger.error(err.message);
                reject(err);
            }
            logger.info('Data selected');
            resolve(row);
        });
    });
}
