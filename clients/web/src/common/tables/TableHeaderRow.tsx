import { Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import { TableRowProps } from './TableRow'

const TableHeaderRow: React.FC<TableRowProps> = ({
  data,
  prefix
}) => {
  return (
    <Thead>
      <Tr>
        {prefix && <Th>{prefix}</Th>}
        {data.map((d, i) => (
          <Th key={i}>{d}</Th>
        ))}
      </Tr>
    </Thead>
  )
}

export default TableHeaderRow
