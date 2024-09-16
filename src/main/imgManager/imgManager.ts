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
          //check if the file is an image, if not, delete it and throw an error
          isImage(path.join(imgsDir, fileName)).then((isImage) => {
            if (!isImage) {
              fs.unlinkSync(path.join(imgsDir, fileName))
              logger.error('El archivo no es una imagen')
              reject(new Error('El archivo que se intenta agregar no es una imagen'))
            }
          })
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

  if(!(await isImage(filePath))) {
    throw new Error('El archivo no es una imagen')
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
    logger.error(`Error al leer la imagen: ${(err as Error).message}`)
    return false
  }
}

export const saveImage = async (imgPath: string): Promise<string> => {
  if (!imgPath || imgPath.trim() === '') throw new Error('Ruta no válida')

  if (imgPath.startsWith('http')) {
    return saveImageFromUrl(imgPath)
  } else {
    return saveImageFromLocalFile(imgPath)
  }
}
