import { useState, useEffect } from "react"
import AddImageDialog from "./AddImageDialog"
import { RenderImages } from "./RenderImages"


const ShowImages = () => {
  const [thereIsImage, setThereIsImage] = useState(false)
  const [imgUrl, setImgUrl] = useState<string>('')

  useEffect(() => {
    fetchImageUrl();
  }, [])

  const fetchImageUrl = async () => {
    try {
      const url = await window.api.getImgUrl()
      if (url) {
        setImgUrl(url)
        setThereIsImage(true)
      } else {
        setThereIsImage(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      { thereIsImage 
      ? 
        <RenderImages url={imgUrl} onDelete={fetchImageUrl} />
      :
        <AddImageDialog onInsert={fetchImageUrl} />
      }
    </>
  )
}

export default ShowImages
