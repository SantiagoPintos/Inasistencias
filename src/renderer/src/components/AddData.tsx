import { useState } from 'react'
import { AddUrl } from './AddUrl'
import SelectSheetPage from './SelectSheetPage'
import { Progress } from './ui/Progress'

const AddData = () => {
    const API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/'
    const [id, setId] = useState<string>('')
    const [names, setNames] = useState<[]>([])
    const [token, setToken] = useState<string>('')
    const [showUrlInput, setShowUrlInput] = useState<boolean>(true)
    const [processFinished, setProcessFinished] = useState<boolean>(false)
    const [progress, setProgress] = useState(0)

    const handleIdChange = (sheet_id: string, key: string, names: []) => {
        setId(sheet_id)
        setNames(names)
        setToken(key)
        setProgress(33)
        setShowUrlInput(false)
    }

    const handleSheetNameChange = (sheet_name: string) => {
        console.log('handleSheetNameCh:', sheet_name);
        setProgress(66)
        sendDataToDatabase(sheet_name)
    }

    const sendDataToDatabase = async (sheet: string) => {
        setProcessFinished(true)
        await window.api.sendData(token, id, sheet)
        setProgress(100)
    }

    return (
        <div className="grid w-full max-w-sm items-center">
            {!processFinished
            ?
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    {showUrlInput 
                    ?  <AddUrl assignId={handleIdChange} api_url={API_URL}/>
                    :  <SelectSheetPage sheet_names={names} handle_sheet_name={handleSheetNameChange}/>
                    }
                </div>
            :
                <div>
                    
                </div>
            }
            <Progress value={progress} className="mt-3 w-[100%] h-[6px]"/>
        
        </div>
    )
}

export default AddData