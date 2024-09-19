import { Menu, shell, BrowserWindow } from 'electron'
import { relaunchApp } from '../utils/appUtils'

export const setMainMenu = () => {
  const template: Array<object> = [
    {
      label: 'Inasistencias',
      submenu: [{ role: 'quit', label: 'Salir' }]
    },
    {
      label: 'Vista',
      submenu: [
        {
          label: 'Recargar aplicación',
          click: () => {
            relaunchApp()
          }
        },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Reiniciar zoom' },
        { role: 'zoomIn', label: 'Aumentar zoom' },
        { role: 'zoomOut', label: 'Disminuir zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla completa' }
      ]
    },
    {
      label: 'Configuración',
      submenu: [
        {
          label: 'Configuración de la aplicación',
          click: () => {
            const activeWindow = BrowserWindow.getFocusedWindow()
            if (activeWindow) activeWindow.webContents.send('open-settings')
          }
        },
        { role: 'toggleDevTools', label: 'Herramientas de desarrollo' },
        {
          label: 'Source code',
          click: async () => {
            await shell.openExternal('https://github.com/SantiagoPintos/Inasistencias')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
