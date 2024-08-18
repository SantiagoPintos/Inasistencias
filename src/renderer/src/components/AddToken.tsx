import { useRef } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

const AddToken = () => {
    const token = useRef<HTMLInputElement>(null)
    
    const handleSubmit = async () => {
      if(token.current?.value !== '') {
        console.log(token.current!.value)
        await window.api.sendToken(token.current!.value)
        token.current!.value = ''
        console.log('Token sent')
      }
    }

    return (
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" placeholder="Token" ref={token}/>
          <Button type="submit" onClick={handleSubmit}>Guardar</Button>
        </div>
    )
}

export default AddToken