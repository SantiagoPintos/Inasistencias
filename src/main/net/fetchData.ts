type dataFromDb = {
    token: string, 
    sheetId: string, 
    sheetName: string 
}

export async function fetchData(data: dataFromDb) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}/values/${data.sheetName}?key=${data.token}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Something went wrong') 
    const json = await response.json()
    return json  
}