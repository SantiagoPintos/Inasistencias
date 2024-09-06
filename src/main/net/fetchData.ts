import Logger from "../logger/logger"

type dataFromDb = {
    token: string, 
    sheetId: string, 
    sheetName: string 
}

const logger = new Logger()
export function fetchData(data: dataFromDb) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}/values/${data.sheetName}?key=${data.token}`
    fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    })
    .then(response => {
        if(response.ok) {
            return response.json()
        } else {
            throw new Error(response.statusText)
        }
    })
    .then(data => {
        return data.json()
    })
    .catch(err => {
        logger.error('Error fetching the data')
        console.log(err)
        return null
    })    
}