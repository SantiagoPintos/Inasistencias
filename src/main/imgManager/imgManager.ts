import { app } from 'electron';
import crypto from 'crypto';
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
            const fileName = `${Date.now()}.jpg`
            const fileStream = fs.createWriteStream(path.join(imgsDir, fileName))
            res.pipe(fileStream)
            fileStream.on('finish', () => {
                fileStream.close()
                resolve(fileName)
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
    const name = hashUrl(newFilePath)
    return name
}

const hashUrl = (url: string): string => {
    const extension = path.extname(url);
    const name = crypto.createHash('md5').update(url).digest('hex') + extension;
    return name;
}


export const saveImage = async (imgPath: string): Promise<string> => {
    if(!imgPath || imgPath.trim() === '') throw new Error('Ruta no válida')
    if (imgPath.startsWith('http')) {
        return saveImageFromUrl(imgPath)
    } else {
        return saveImageFromLocalFile(imgPath)
    }
}
