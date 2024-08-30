import { app } from 'electron';
import fs from 'fs';
import path from 'path';

class Logger {
  private logFilePath: string;

  constructor(logFileName?: string) {
    const logsDir = path.join(app.getPath('userData'), 'Logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    if(!logFileName) {
      this.logFilePath = path.join(logsDir, 'Main.log')
    } else {
      this.logFilePath = path.join(logsDir, logFileName);
    }
  }

  log(message: string): void {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - 3);
    const formattedTimestamp = timestamp.toISOString();
    const logMessage = `${formattedTimestamp} - ${message}\n`;

    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        throw new Error("Error al escribir en el archivo de log");
      }
    });
  }

  info(message: string): void {
    this.log(`INFO: ${message}`);
  }

  error(message: string): void {
    this.log(`ERROR: ${message}`);
  }
}

export default Logger;