import Logger from './../logger/logger';
const logger = new Logger('urlParser.log');
// from this: https://docs.google.com/spreadsheets/d/1_LfCQsMJY-7Jd2-Gf6edboZnwFJMC_rmSpPJcZxCtP4/edit?usp=sharing
// we need to extract only the id: 1_LfCQsMJY-7Jd2-Gf6edboZnwFJMC_rmSpPJcZxCtP4

export function extractSpreadsheetId(url: string): string | null {
    logger.info('Extracting spreadsheet id');
    const regex = /\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}