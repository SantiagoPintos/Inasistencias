import { Database } from 'sqlite3';
import Logger from '../logger/logger';
const logger = new Logger('dbOperator.log');


export const createData = (db: Database): void => {
    const createTokenTable = `CREATE TABLE IF NOT EXISTS token (token TEXT NOT NULL, PRIMARY KEY(token))`;
    try {
        db.run(createTokenTable, (err) => {
            if(err){
                logger.error(err.message);
            }
            logger.info('Token table created');
        });
    } catch (err) {
        logger.error((err as Error).message);
    } 
}

export const insertToken = async (db: Database, token: string): Promise<void> => {
    const deleteToken = `DELETE FROM token`;
    const insertToken = `INSERT INTO token(token) VALUES(?)`;
    try {
        db.run(deleteToken, (err) => {
            if(err){
                logger.error(err.message);
            }
            logger.info('Token deleted');
        });
        db.run(insertToken, [token], (err) => {
            if(err){
                logger.error(err.message);
            }
            logger.info('Token inserted');
        });
    } catch (err) {
        logger.error((err as Error).message);
    }
}

export const getToken = async (db: Database): Promise<string> => {
    const selectToken = `SELECT token FROM token`;
    return new Promise((resolve, reject) => {
        db.get(selectToken, (err, row) => {
            if(err){
                logger.error(err.message);
                reject(err);
            }
            logger.info('Token selected');
            resolve((row as { token: string }).token);
        });
    });
}
