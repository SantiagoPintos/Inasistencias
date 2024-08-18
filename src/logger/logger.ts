import { app } from 'electron';
import fs from 'fs';
import path from 'path';

class Logger {
  private logFilePath: string;

  constructor(logFileName: string) {
    const logsDir = path.join(app.getPath('userData'), 'Logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    this.logFilePath = path.join(logsDir, logFileName);
  }

  log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        throw new Error("Error al escribir en el archivo de log");
      }
    });
  }
}

export default Logger;