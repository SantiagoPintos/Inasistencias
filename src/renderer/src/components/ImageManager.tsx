import { useState, useEffect } from "react"
import AddImageDialog from "./AddImageDialog"
import { RenderImages } from "./RenderImages"


const ShowImages = () => {

  const [thereIsImage, setThereIsImage] = useState(false)
  const [imgUrl, setImgUrl] = useState<string>('')

  useEffect(() => {
    window.api.getImgUrl()
      .then((url) => {
        if (url) {
          setImgUrl(url)
          setThereIsImage(true)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <>
      { thereIsImage 
      ? 
        <RenderImages url={imgUrl} />
      :
        <AddImageDialog />
      }
    </>
  )
}

export default ShowImages