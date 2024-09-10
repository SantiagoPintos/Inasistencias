import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddUrl } from './AddUrl'
import SelectSheetPage from '../SelectSheetPage'
import { Progress } from '../ui/Progress'
import { Alert, AlertDescription, AlertTitle } from "../ui/Alert"
import { Check } from 'lucide-react'


const AddData = () => {
    const navigate = useNavigate()
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
        sendDataToDatabase(sheet_name)
    }

    const sendDataToDatabase = async (sheet: string) => {
        setProgress(100)
        setProcessFinished(true)
        await window.api.sendData(token, id, sheet)
        setTimeout(() => {
            //delay to show the alert
            navigate('/')
        }, 2000)
    }

    return (
        <div className="h-screen flex items-center justify-center">
            {!processFinished
            ?
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    {showUrlInput 
                    ?  <AddUrl assignId={handleIdChange} api_url={API_URL}/>
                    :  <SelectSheetPage sheet_names={names} handle_sheet_name={handleSheetNameChange}/>
                    }
                    <Progress value={progress} className="mt-3 w-[100%] h-[6px]"/>
                </div>
            :
                <div>
                    <Alert>
                      <Check className="h-4 w-4" />
                      <AlertTitle>Datos guardados!</AlertTitle>
                      <AlertDescription>
                        La aplicación te redirigirá a la página principal.
                      </AlertDescription>
                    </Alert>
                </div>
            }
        
        </div>
    )
}

export default AddData