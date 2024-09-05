import { useState } from "react"
import { Button } from "./ui/Button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/Alert"


export const RenderImages = ({url, onDelete}) => {
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [error, setError] = useState(false)

    const handleClick = () => {
        setShowConfirmation(true)
    }

    const handleConfirmation = async () => {
        const deleteImage = await window.api.deleteImage()
        if (deleteImage) {
            setShowConfirmation(false)
            setTimeout(() => {
                setError(false)
                onDelete()
            }, 1000)
        } else {
            setShowConfirmation(false)
            setError(true)
        }
    }

    const handleCancelation = () => {
        setShowConfirmation(false)
    }

    return (
        <div className="w-[85%] h-[85%]">
            <TooltipProvider>
                <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                        <img 
                            src={`inasistencias://${url}`} 
                            alt="Imagen" 
                            className="aspect-auto transition duration-300 ease-in-out hover:blur-sm" 
                        />
                    </TooltipTrigger>
                    <TooltipContent className="p-0">
                        <Button onClick={handleClick}>Eliminar imagen</Button>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={showConfirmation}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Eliminar imagen</DialogTitle>
                            <DialogDescription>
                                ¿Está seguro de que desea eliminar la imagen?
                            </DialogDescription>
                    </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCancelation}>Cancelar</Button>
                            <Button onClick={handleConfirmation}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            { error &&
                <Alert variant="destructive">
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                        Ha ocurrido un error al eliminar la imagen.
                    </AlertDescription>
                </Alert>
            }
        </div>
    )
}
