import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/Select'
import { Button } from '@renderer/components/ui/Button'

const SelectSheetPage = ({ sheet_names, handle_sheet_name }) => {
  const [thereAreSheets, setThereAreSheets] = useState<boolean>(true)
  const [selectedSheet, setSelectedSheet] = useState<string>('')

  useEffect(() => {
    if (sheet_names.length === 0) {
      setThereAreSheets(false)
    }
  }, [])

  const handleSheetChange = (sheet_name: string) => {
    setSelectedSheet(sheet_name)
  }

  const handleClick = () => {
    handle_sheet_name(selectedSheet)
  }

  return (
    <div>
      {thereAreSheets ? (
        <div className="grid w-full max-w-sm items-center">
          <Select onValueChange={handleSheetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la hoja de la planilla:" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Hojas...</SelectLabel>
                {sheet_names &&
                  sheet_names.map((name: string, index: number) => (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="mx-auto mt-4 w-[50%]" onClick={handleClick}>
            Guardar
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default SelectSheetPage
