import { app } from 'electron';
import fs, { Stats } from 'fs';
import path from 'path';

export async function getLogsFileSize(): Promise<number> {
    const directoryPath: string = path.join(app.getPath('userData'), 'Logs');
    let tamañoTotal: number = 0;
    const archivos: string[] = await fs.promises.readdir(directoryPath);

    for (const archivo of archivos) {
        const rutaArchivo: string = path.join(directoryPath, archivo);
        const tamañoArchivo: number = await getFileSize(rutaArchivo);
        tamañoTotal += tamañoArchivo;
    }

    return tamañoTotal;
}

function getFileSize(file: string): Promise<number> {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err: NodeJS.ErrnoException | null, stats: Stats) => {
            if (err) {
                reject(err);
            } else {
                resolve(stats.size);
            }
        });
    });
}
