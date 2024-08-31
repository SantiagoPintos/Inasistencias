import { Button } from "./ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs"
import { Input } from "./ui/Input"

const ShowImages = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar imagen para mostrar</Button>
      </DialogTrigger>
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
                    <Input id="username" defaultValue="" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Guardar</Button>
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
                    <Input id="username" type="file" defaultValue="" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Guardar</Button>
                </CardFooter>
              </Card>

            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShowImages