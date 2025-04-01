import { Table as TablePrimitive } from '@radix-ui/react-table';
import { cn } from '@/lib/utils';

export function Table({ data, columns, isLoading }: any) {
  return (
    <div className="rounded-md border">
      <TablePrimitive>
        <TablePrimitive.Header>
          {columns.map((column: any) => (
            <TablePrimitive.HeaderCell key={column.accessorKey}>
              {column.header}
            </TablePrimitive.HeaderCell>
          ))}
        </TablePrimitive.Header>
        <TablePrimitive.Body>
          {isLoading ? (
            <TablePrimitive.Row>
              <TablePrimitive.Cell colSpan={columns.length}>
                Carregando...
              </TablePrimitive.Cell>
            </TablePrimitive.Row>
          ) : (
            data.map((row: any) => (
              <TablePrimitive.Row key={row.id}>
                {columns.map((column: any) => (
                  <TablePrimitive.Cell key={column.accessorKey}>
                    {row[column.accessorKey]}
                  </TablePrimitive.Cell>
                ))}
              </TablePrimitive.Row>
            ))
          )}
        </TablePrimitive.Body>
      </TablePrimitive>
    </div>
  );
}
