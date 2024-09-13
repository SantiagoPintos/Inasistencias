import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/Table'

const ShowData = ({ data }) => {
  if (!data || data.length === 0) return null
  data = data.values.slice(1)

  return (
    <div className="mt-5 ml-10">
      <h1 className="text-2xl font-bold text-center mb-5">Inasistencias docentes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{data[0][0]}</TableHead>
            <TableHead>{data[0][1]}</TableHead>
            <TableHead>{data[0][2]}</TableHead>
            <TableHead className="text-right">{data[0][3]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(1).map((item: any[], index: number) =>
            item.length > 0 ? (
              <TableRow key={index}>
                <TableCell>{item[0]}</TableCell>
                <TableCell>{item[1]}</TableCell>
                <TableCell>{item[2]}</TableCell>
                <TableCell className="text-right">{item[3]}</TableCell>
              </TableRow>
            ) : null
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ShowData
