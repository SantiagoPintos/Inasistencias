import { Database } from 'sqlite3';
import Logger from '../logger/logger';
const logger = new Logger('dbOperator.log');


export const createData = (db: Database): void => {
    const createDataTable = `CREATE TABLE IF NOT EXISTS data (token TEXT NOT NULL, url TEXT NOT NULL, sheetName TEXT NOT NULL, PRIMARY KEY(token))`;
    try {
        db.run(createDataTable, (err) => {
            if(err){
                logger.error(`Creating tables: ${err.message}`);
            }
            logger.info('Data table created');
        });
    } catch (err) {
        logger.error((err as Error).message);
    } 
}

export const insertData = async (db: Database, token: string, url: string, sheetName): Promise<void> => {
    const deleteData = `DELETE FROM data`;
    const insertData = `INSERT INTO data (token, url, sheetName) VALUES (?, ?, ?)`;
    if(token === '' || url === '' || sheetName === '') {
        logger.error('Incomplete data received');
        return;
    }
    try {
        db.run(deleteData, (err) => {
            if(err){
                logger.error(`Inserting data: ${err.message}`);
            }
            logger.info('Data deleted');
        });
        db.run(insertData, [token, url, sheetName], (err) => {
            if(err){
                logger.error(err.message);
            }
            logger.info('Data inserted');
        });
    } catch (err) {
        logger.error((err as Error).message);
    }
}

export const getTokenAndSheetName = async (db: Database): Promise<{ token: string, sheetId: string, sheetName: string }> => {
    const selectData = `SELECT token, url, sheetName FROM data`;

    try {
        return new Promise((resolve, reject) => {
            db.get(selectData, [], (err, row: { token: string, url: string, sheetName: string }) => {
                if (err) {
                    logger.error(`Getting data: ${err.message}`);
                    reject(err);
                }
            
                if (row) {
                    logger.info('Data selected');
                    resolve({ token: row.token, sheetId: row.url, sheetName: row.sheetName });
                } else {
                    reject(new Error('Getting data: No data found'));
                }
            });
        });
    } catch (err) {
        logger.error((err as Error).message);
        throw err;
    }
}

