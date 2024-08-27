import { useState } from 'react'
import { AddUrl } from './AddUrl'


const AddData = () => {
    const [id, setId] = useState<string>('')
    const [names, setNames] = useState<object[]>([])

    const handleIdChange = (id: string, names: object[]) => {
        setId(id)
        setNames(names)
        console.log('habdle id ',id)
        console.log('habdle names ',names)
    }

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <AddUrl assignId={handleIdChange}/>
        </div>
    )
}

export default AddData