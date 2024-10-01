import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@renderer/components/ui/Separator'
import { Button } from '@renderer/components/ui/Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/Alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@renderer/components/ui/Alert'
import { Switch } from '@renderer/components/ui/Switch'
import { Check, AlertCircle, CircleArrowLeft } from 'lucide-react'
import { Input } from '@renderer/components/ui/Input'

const Settings = () => {
  const navigate = useNavigate()
  const [logsSize, setLogsSize] = useState<number | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [alertVariant, setAlertVariant] = useState<'default' | 'destructive'>('default')
  const [alertTitle, setAlertTitle] = useState<'Error' | 'Correcto'>('Correcto')
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertIcon, setAlertIcon] = useState<React.ReactNode>(<Check />)
  const [startOnBoot, setStartOnBoot] = useState<boolean>(false)
  const [updateInterval, setUpdateInterval] = useState<number>(0)

  useEffect(() => {
    const logsFileSize = async () => {
      const size = await window.api.getLogsFileSize()
      if (size) setLogsSize(size)
    }
    getStartOnBootStatus()
    logsFileSize()
    getUpdateInterval()
  }, [])

  const handleDeleteClick = async () => {
    const deleted = await window.api.clearLogs()
    if (deleted) {
      setLogsSize(0)
      setShowConfirmation(true)
      setAlertMessage('Registros eliminados correctamente')
      setAlertVariant('default')
      setAlertTitle('Correcto')
      setAlertIcon(<Check />)
      setTimeout(() => {
        setShowConfirmation(false)
      }, 2000)
    } else {
      setShowConfirmation(true)
      setAlertMessage('Error al eliminar los registros')
      setAlertVariant('destructive')
      setAlertTitle('Error')
      setAlertIcon(<AlertCircle />)
      setTimeout(() => {
        setShowConfirmation(false)
      }, 2000)
    }
  }

  const handleGoBack = () => {
    navigate('/')
  }

  const handleDataDeletion = async () => {
    const result = await window.api.deleteAllData()
    setShowConfirmation(true)
    if (result) {
      setAlertMessage('Datos eliminados correctamente')
    } else {
      setAlertVariant('destructive')
      setAlertTitle('Error')
      setAlertIcon(<AlertCircle />)
      setAlertMessage('Error al eliminar los datos')
    }
    setTimeout(() => {
      setShowConfirmation(false)
    }, 2000)
  }

  const handleStartOnBootChange = async () => {
    try {
      const status = await window.api.setStartOnBoot(!startOnBoot)
      setStartOnBoot(status)
    } catch (err) {
      console.error(err)
      setShowConfirmation(true)
      setAlertMessage('Error al guardar la configuración')
      setAlertVariant('destructive')
      setAlertTitle('Error')
      setAlertIcon(<AlertCircle />)
      setTimeout(() => {
        setShowConfirmation(false)
      }, 3000)
    }
  }

  const getStartOnBootStatus = async () => {
    setStartOnBoot(await window.api.getStartOnBootStatus())
  }

  const getUpdateInterval = async () => {
    try {
      setUpdateInterval(await window.api.getUpdateInterval()) 
    } catch (err) {
      console.error(err)
      setShowConfirmation(true)
      setAlertMessage('Error al obtener la configuración')
      setAlertVariant('destructive')
      setAlertTitle('Error')
      setAlertIcon(<AlertCircle />)
      setTimeout(() => {
        setShowConfirmation(false)
      }, 3000)
    }
  }


  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        {showConfirmation && (
          <Alert variant={alertVariant}>
            {alertIcon}
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-0.5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
            <p className="text-muted-foreground">
              Administre las diferentes características de la aplicación.
            </p>
          </div>
          <Button onClick={handleGoBack}>
            <CircleArrowLeft className="mr-2" />
            Volver
          </Button>
        </div>
        <Separator className="my-6" />
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Iniciar aplicación al arrancar el sistema
          </h2>
          <div className="flex items-center space-x-2 pt-2">
            <label htmlFor="startOnBootSwitch">Iniciar al arranque</label>
            <Switch
              id="startOnBootSwitch"
              onCheckedChange={handleStartOnBootChange}
              checked={startOnBoot}
            ></Switch>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Intervalo de actualización
          </h2>
          <label>Frecuencia con la que se actualizan los datos</label>
          <div className="w-full max-w-xs space-y-1">
            <Input type="text" disabled value={updateInterval}/>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Logs</h2>
          <p className="text-muted-foreground mb-2">Tamaño de los registros: {logsSize} KB</p>
          <Button onClick={handleDeleteClick}> Eliminar registros </Button>
        </div>
        <Separator className="my-6" />
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Borrar datos</h2>
          <p className="text-muted-foreground mb-2">
            Esta acción reiniciará la aplicación a su estado inicial
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Eliminar datos</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Está seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. ¿Está seguro de que desea continuar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDataDeletion}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  )
}

export default Settings
