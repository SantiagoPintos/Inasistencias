import { useEffect, useState } from 'react'
import { Separator } from './ui/Separator'

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
                <p className="text-muted-foreground">
                    Tamaño de los registros: {logsSize ? Math.round(logsSize / 1024) : 0} KB
                </p>
            </div>
        </div>
    </>
  )
}

export default Settings