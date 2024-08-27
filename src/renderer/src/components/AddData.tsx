import { useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/Alert"

const AddData = () => {
    const token = useRef<HTMLInputElement>(null)
    const sheetId = useRef<HTMLInputElement>(null)
    const [showAlert, setShowAlert] = useState(false)
    
    const handleSubmit = async () => {
      if(token.current?.value !== '' && sheetId.current?.value !== '') {
        await window.api.sendToken(token.current!.value)
        token.current!.value = ''
        sheetId.current!.value = ''
      } else {
        setShowAlert(true)
      }
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
          <Label htmlFor="token">API Key</Label>
          <Input type="text" id="token" placeholder="API Key" className='mb-5' ref={token}/>
          <Label htmlFor="sheet" >URL de Google Sheets</Label>
          <Input type="text" id="sheet" placeholder="https://docs.google.com/spreadsheets/d/1_LfCQsMJY-7Jd2-Gf6edboZnwFJMC_rmSpasdfa4/" className='mb-5' ref={sheetId}/>
          <Button type="submit" onClick={handleSubmit}>Guardar</Button>
        </div>
    )
}

export default AddData