import { Separator } from './ui/Separator'

const Settings = () => {
  return (
    <>
        <div className="hidden space-y-6 p-10 pb-16 md:block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Ajustes</h2>
                <p className="text-muted-foreground">
                    Administre los ajustes de la aplicación.
                </p>
            </div>
            <Separator className="my-6" />
        </div>
    </>
  )
}

export default Settings