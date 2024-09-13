import { app } from 'electron'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import * as https from 'https'
import sharp from 'sharp'
import Logger from '../logger/logger'

const logger = new Logger()
const imgsDir = path.join(app.getPath('userData'), 'LocalImages')

const saveImageFromUrl = async (imageUrl: string): Promise<string> => {
  if (!fs.existsSync(imgsDir)) {
    fs.mkdirSync(imgsDir)
  }

  return new Promise((resolve, reject) => {
    https
      .get(imageUrl, (res) => {
        if (res.statusCode !== 200) {
          logger.error(`Error al descargar la imagen: ${res.statusMessage}`)
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
    fs.mkdirSync(imgsDir)
  }

  const name = path.basename(filePath)
  const fileName = hashUrl(name)
  const newFilePath = path.join(imgsDir, fileName)
  fs.copyFileSync(filePath, newFilePath)
  return fileName
}

const hashUrl = (url: string): string => {
  const extension = path.extname(url)
  const name = crypto.createHash('md5').update(url).digest('hex') + extension
  return name
}

const isImage = async (imgPath: string): Promise<boolean> => {
  try {
    await sharp(imgPath).metadata()
    return true
  } catch (err) {
    return false
  }
}

export const saveImage = async (imgPath: string): Promise<string> => {
  if (!imgPath || imgPath.trim() === '') throw new Error('Ruta no válida')

  if (!(await isImage(imgPath))) {
    throw new Error('El archivo no es una imagen válida')
  }

  if (imgPath.startsWith('http')) {
    return saveImageFromUrl(imgPath)
  } else {
    return saveImageFromLocalFile(imgPath)
  }
}
