import { databaseConnector } from './../dbManager/dbConnection' 
import { getTokenAndSheetName } from './../dbManager/dbOperator'

interface DataFromApi {
    range: string;
    majorDimension: string;
    values: string[][];
}

export async function fetchData(): Promise<DataFromApi|null> {    
    const db = databaseConnector()
    const dataFromDb = await getTokenAndSheetName(db)
    if(dataFromDb.token === undefined || dataFromDb.token === null) {
        return null
    }
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${dataFromDb.sheetId}/values/${dataFromDb.sheetName}?key=${dataFromDb.token}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Something went wrong') 
    return await response.json()
}
