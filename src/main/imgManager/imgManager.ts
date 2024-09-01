import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import * as https from 'https'

const imgsDir = path.join(app.getPath('userData'), 'LocalImages');

const saveImageFromUrl = async (imageUrl: string): Promise<string> => {
    if (!fs.existsSync(imgsDir)) {
        fs.mkdirSync(imgsDir);
    }

    return new Promise((resolve, reject) => {
        https.get(imageUrl, (res)=> {
            if(res.statusCode !== 200) {
                reject(new Error('Imagen no encontrada'))
                return
            }
            const fileStream = fs.createWriteStream(path.join(imgsDir, `${Date.now()}.jpg`))
            res.pipe(fileStream)
            fileStream.on('finish', () => {
                fileStream.close()
                resolve(fileStream.path.toString())
            })       
        })
        .on('error', (err) => {
            reject(err)
        })
    })
}

const saveImageFromLocalFile = async (filePath: string): Promise<string> => {
    if (!fs.existsSync(imgsDir)) {
        fs.mkdirSync(imgsDir);
    }

    const fileName = path.basename(filePath)
    const newFilePath = path.join(imgsDir, fileName)
    fs.copyFileSync(filePath, newFilePath)
    return newFilePath
}

export const saveImage = async (imgPath: string): Promise<string> => {
    if(!imgPath || imgPath.trim() === '') throw new Error('Ruta no válida')
    if (imgPath.startsWith('http')) {
        return saveImageFromUrl(imgPath)
    } else {
        return saveImageFromLocalFile(imgPath)
    }
}
