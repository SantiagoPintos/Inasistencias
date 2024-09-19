import { app } from 'electron'

export const relaunchApp = () => {
    app.relaunch()
    app.quit()
}