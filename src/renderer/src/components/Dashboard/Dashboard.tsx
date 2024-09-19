import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ShowData from './showData'
import ShowImages from './ImageManager'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './../ui/ResizablePanel'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@renderer/components/ui/ContextMenu"

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state
  const [panelVisible, setPanelVisible] = useState<boolean>(true)
  const [panelTableSize, setPanelTableSize] = useState<number>(65)
  const [panelImageSize, setPanelImageSize] = useState<number>(35)
  const [btnText, setBtnText] = useState<'Ocultar panel de imágenes' | 'Mostrar panel de imágenes'>('Ocultar panel de imágenes')

  const handlePanelVisibility = () => {
    if (panelVisible) {
      setPanelTableSize(100)
      setPanelImageSize(0)
      setBtnText('Mostrar panel de imágenes')
    } else {
      setPanelTableSize(65)
      setPanelImageSize(35)
      setBtnText('Ocultar panel de imágenes')
    }
    setPanelVisible(!panelVisible)
  }

  const handleGoToSettings = () => {
    navigate('/settings')
  }

  const handleRelaunchApp = () => {
    window.api.relaunchApp()
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger> 
        <ResizablePanelGroup direction="horizontal" className="max-w max-h">
            <ResizablePanel 
              key={panelTableSize}
              defaultSize={panelTableSize} 
              collapsible={true}>
              <div>
                <ShowData data={data} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              key={panelImageSize} 
              defaultSize={panelImageSize} 
              collapsible={true}>
              <div className="h-screen flex items-center justify-center">
                <ShowImages />
              </div>
            </ResizablePanel>
        </ResizablePanelGroup>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handlePanelVisibility}>{btnText}</ContextMenuItem>
        <ContextMenuItem onClick={handleGoToSettings}>Ajustes</ContextMenuItem>
        <ContextMenuItem onClick={handleRelaunchApp}>Reiniciar la aplicación</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default Dashboard
