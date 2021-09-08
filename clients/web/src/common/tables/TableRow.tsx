import { Td, Tr } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

export interface TableRowProps {
  data: any[]
  prefix?: ReactNode
}

/**
 * A Chakra Table row with an option to add components before the data.
 */
const TableRow: React.FC<TableRowProps> = ({ data, prefix }) => {
  return (
    <Tr>
      {prefix && <Td>{prefix}</Td>}
      {data.map((d, i) => (
        <Td key={i}>{d}</Td>
      ))}
    </Tr>
  )
}

export default TableRow
