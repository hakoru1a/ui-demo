// material-ui
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// third-party
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import { Fragment } from 'react';

// project imports
import CircularLoader from 'components/CircularLoader';
import ScrollX from 'components/ScrollX';
import { EmptyTable, HeaderSort, TablePagination } from 'components/third-party/react-table';

// types
import type { ShiftLog } from '../types';

interface ShiftLogTableProps {
  table: TanStackTable<ShiftLog>;
  data: ShiftLog[];
  loading?: boolean;
  initialPageSize?: number;
}

// ==============================|| SHIFT LOG TABLE ||============================== //

const ShiftLogTable = ({ table, data, loading = false, initialPageSize = 10 }: ShiftLogTableProps) => {
  // Render table
  const renderTable = () => {
    if (loading) {
      return <CircularLoader />;
    }

    if (data.length === 0) {
      return <EmptyTable msg="Không tìm thấy nhật ký ca nào" />;
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableCell sx={{ width: 50 }} />
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as { hidden?: boolean } | undefined;
                  if (meta?.hidden) {
                    return null;
                  }

                  const headerMeta = header.column.columnDef.meta as { hidden?: boolean; align?: 'left' | 'center' | 'right' } | undefined;
                  return (
                    <TableCell
                      key={header.id}
                      {...(header.column.columnDef.meta || {})}
                      {...(header.column.getCanSort() && {
                        onClick: header.column.getToggleSortingHandler(),
                        sx: { cursor: 'pointer', userSelect: 'none' }
                      })}
                      sx={{
                        ...(headerMeta?.align && { textAlign: headerMeta.align })
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: headerMeta?.align === 'center' ? 'center' : 'flex-start'
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                            {header.column.getCanSort() && <HeaderSort column={header.column} sort />}
                          </>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Fragment key={row.id}>
                  <TableRow hover selected={row.getIsSelected()}>
                    <TableCell />
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as { hidden?: boolean; align?: 'left' | 'center' | 'right' } | undefined;
                      if (meta?.hidden) {
                        return null;
                      }
                      return (
                        <TableCell
                          key={cell.id}
                          {...(cell.column.columnDef.meta || {})}
                          sx={{
                            ...(meta?.align && { textAlign: meta.align })
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <ScrollX>{renderTable()}</ScrollX>
      {data.length > 0 && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <TablePagination
            setPageSize={table.setPageSize}
            setPageIndex={table.setPageIndex}
            getState={table.getState}
            getPageCount={table.getPageCount}
            initialPageSize={initialPageSize}
          />
        </Box>
      )}
    </>
  );
};

export default ShiftLogTable;
