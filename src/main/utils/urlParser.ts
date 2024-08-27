import Logger from './../logger/logger';
const logger = new Logger('urlParser.log');
// from this: https://docs.google.com/spreadsheets/d/1_LfCQsMJY-7Jd2-Gf6edboZnwFJMC_rmSpPJcZxCtP4/edit?usp=sharing
// we need to extract only the id: 1_LfCQsMJY-7Jd2-Gf6edboZnwFJMC_rmSpPJcZxCtP4

export function extractSpreadsheetId(url: string): string | null {
    logger.info('Extracting spreadsheet id');
    try{
        const regex = /\/d\/([a-zA-Z0-9-_]+)/;
        const match = url.match(regex);
        logger.info('Spreadsheet id extracted');
        return match ? match[1] : null;
    } catch (err) {
        logger.error('Error extracting the id: '+(err as Error).message);
        return null;
    }
}