import { useRef, useState } from "react"
import { Button } from "./../ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./../ui/Dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./../ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./../ui/Tabs"
import { Input } from "./../ui/Input"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./../ui/Alert"
import { Check, AlertCircle } from "lucide-react"


const AddImageDialog = ({onInsert}) => {
    const url = useRef<HTMLInputElement>(null)
    const filePath = useRef<HTMLInputElement>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")


    const handleSave = async (activeTab: string) => {
        if (activeTab !== "url" && activeTab !== "file") {
          handleErrorAlert();
          return;
        }
      
        try {
          if (activeTab === "url") {
            if (!url.current?.value) {
              setErrorMessage("La URL no es válida");
              throw new Error("URL is required");
            }
            await window.api.sendImgUrl(url.current.value);
          } else {
            if (filePath.current?.files?.length !== 1) {
              setErrorMessage("El archivo no es válido");
              throw new Error("File is required");
            }
            const file = filePath.current.files[0];
            if (!file.type.startsWith("image/")) {
              setErrorMessage("Tipo de archivo no válido o tamaño excedido");
              throw new Error("Invalid file type or size");
            }
            await window.api.sendImgUrl(file.path);
          }
          handleSuccessAlert();
          setShowDialog(false);
          setTimeout(() => {
            onInsert();
          }, 1000);
        } catch (error) {
          handleErrorAlert();
        }
      };

      const handleSuccessAlert = () => {
        setShowSuccessAlert(true)
        setTimeout(() => {
          setShowSuccessAlert(false)
        }, 3000)
      }
    
      const handleErrorAlert = () => {
        setShowErrorAlert(true)
        setTimeout(() => {
          setShowErrorAlert(false)
        }, 3000)
      }

      const handleOpenDialog = () => {
        setShowDialog(true)
      }


    return (
      <>
        <Button variant="outline" onClick={handleOpenDialog}>Agregar imagen para mostrar</Button>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar imagen</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="url">
                <TabsList>
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="local">Archivo local</TabsTrigger>
                </TabsList>
                <TabsContent value="url">
                  <Card>
                    <CardHeader>
                      <CardDescription>
                        Pegue la URL de la imagen.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Input id="username" defaultValue="" ref={url} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={()=>handleSave("url")}>Guardar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="local">
                  <Card>
                    <CardHeader>
                      <CardDescription>
                        Seleccione la imagen de su equipo.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Input id="username" type="file" defaultValue="" ref={filePath}/>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={()=>handleSave("file")}>Guardar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
              {showSuccessAlert && (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertTitle>Guardado!</AlertTitle>
                  <AlertDescription>
                    La imagen se guardó correctamente.
                  </AlertDescription>
                </Alert>
              )}
              {showErrorAlert && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorMessage}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
}

export default AddImageDialog
