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