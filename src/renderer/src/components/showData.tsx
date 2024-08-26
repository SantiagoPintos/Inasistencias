import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@renderer/components/ui/Table"

const ShowData = ({data}) => {
  if(data.length === 0) return null

  // Remove the headers
  data=data.slice(2)

  return (
    <div className="mt-10 ml-10">
      <h1 className="text-2xl font-bold text-center my-10">Inasistencias docentes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Desde</TableHead>
            <TableHead className="text-right">Hasta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item[0]}</TableCell>
              <TableCell>{item[1]}</TableCell>
              <TableCell>{item[2]}</TableCell>
              <TableCell className="text-right">{item[3]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ShowData