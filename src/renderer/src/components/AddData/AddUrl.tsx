import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert'

export const AddUrl = ({ assignId, api_url }) => {
  const [token, setToken] = useState<string>('')
  const [sheetId, setSheetId] = useState<string>('')
  const [showAlert, setShowAlert] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)

  const handleSubmit = async () => {
    setShowAlert(false)
    const id = extractSpreadsheetId(sheetId)

    setTimeout(async () => {
      if (id && token) {
        checkData(id, token)
      } else {
        setShowAlert(true)
      }
    }, 500) // Retardo para simular la carga
  }

  const extractSpreadsheetId = (url: string): string | null => {
    try {
      const regex = /\/d\/([a-zA-Z0-9-_]+)/
      const match = url.match(regex)
      return match ? match[1] : null
    } catch (err) {
      return null
    }
  }

  const extractSpreadSheetNames = (sheets): string[] => {
    const names: string[] = []
    sheets.forEach((sheet) => {
      names.push(sheet.properties.title)
    })
    return names
  }

  const checkData = (id: string, token: string) => {
    const fullUrl = `${api_url}${id}/?key=${token}`
    fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Error')
      })
      .then((data) => {
        if (data.sheets) {
          const names = extractSpreadSheetNames(data.sheets)
          assignId(id, token, names)
        } else {
          setShowAlert(true)
        }
      })
      .catch((err) => {
        setShowAlert(true)
        console.error(err)
      })
  }

  const handleButtonState = () => {
    if (token !== '' && sheetId !== '') {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }

  return (
    <>
      {showAlert && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Datos incorrectos</AlertDescription>
        </Alert>
      )}
      <>
        <Label htmlFor="token">API Key</Label>
        <Input
          type="text"
          id="token"
          placeholder="API Key"
          className="mb-5"
          value={token}
          onChange={(e) => {
            setToken(e.target.value)
            handleButtonState()
          }}
        />
        <Label htmlFor="sheet">URL de Google Sheets</Label>
        <Input
          type="text"
          id="sheet"
          placeholder="https://docs.google.com/spreadsheets/d/1_LfCQsMJY-7Jd2-Gf6edboZnwFJMC_rmSpasdfa4/"
          className="mb-5"
          value={sheetId}
          onChange={(e) => {
            setSheetId(e.target.value)
            handleButtonState()
          }}
        />
        <Button disabled={buttonDisabled} type="submit" onClick={handleSubmit}>
          Guardar
        </Button>
      </>
    </>
  )
}
