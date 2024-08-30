import { useEffect, useState } from 'react'
import { Separator } from './ui/Separator'
import { Button } from './ui/Button'

const Settings = () => {
  const [ logsSize, setLogsSize ] = useState<number | null>(null)

  useEffect(() => {
    const logsFileSize = async () => {
      const size = await window.api.getLogsFileSize()
      if(size) setLogsSize(size)
      console.log(size)
    }
    logsFileSize()
  }, [])

  const handleDeleteClick = async () => {
    await window.api.clearLogs()
    const size = await window.api.getLogsFileSize()
    if(size) setLogsSize(size)
  }


  return (
    <>
        <div className="hidden space-y-6 p-10 pb-16 md:block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
                <p className="text-muted-foreground">
                    Administre las diferentes características de la aplicación.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Logs</h2>
                <p className="text-muted-foreground mb-2">
                    Tamaño de los registros: {logsSize ? Math.round(logsSize / 1024) : 0} KB
                </p>
                <Button
                    onClick={handleDeleteClick}
                > Eliminar registros </Button>
            </div>
        </div>
    </>
  )
}

export default Settings