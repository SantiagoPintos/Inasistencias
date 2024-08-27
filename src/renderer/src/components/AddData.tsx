import { useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/Alert"
import { Progress } from './ui/Progress'

const AddData = () => {
    const [token, setToken] = useState<string>('')
    const [sheetId, setSheetId] = useState<string>('')
    const [showAlert, setShowAlert] = useState(false)
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    
    const handleSubmit = async () => {
      setShowAlert(false)
      setLoading(true)
      setProgress(20)

      setTimeout(async () => {
        if(sheetId && token){
          setProgress(50)
          await window.api.sendData(token, sheetId)
          setProgress(100)
          setLoading(false)
        } else {
          setProgress(100)
          setLoading(false)
          setShowAlert(true)
        }
        setSheetId('')
        setToken('')
      }, 500); // Retardo para simular la carga
    }

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          {showAlert && (
            <Alert variant="destructive" className="mb-5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Datos incorrectos</AlertDescription>
            </Alert>
          )}
          {loading ? (
            <Progress value={progress} className="mb-5" />
          ) : (
            <>
              <Label htmlFor="token">API Key</Label>
              <Input type='text' id="token" placeholder="API Key" className='mb-5' value={token} onChange={(e)=>setToken(e.target.value)}/>
              <Label htmlFor="sheet" >URL de Google Sheets</Label>
              <Input type='text' id="sheet" placeholder="https://docs.google.com/spreadsheets/d/1_LfCQsMJY-7Jd2-Gf6edboZnwFJMC_rmSpasdfa4/" className='mb-5' value={sheetId} onChange={(e)=>setSheetId(e.target.value)}/>
              <Button type="submit" onClick={handleSubmit}>Guardar</Button>
            </>
            )}
        </div>
    )
}

export default AddData