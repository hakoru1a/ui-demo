// ==============================|| PAB TABLE ||============================== //

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import { Fragment } from 'react';

// project imports
import CircularLoader from 'components/CircularLoader';
import ScrollX from 'components/ScrollX';
import { EmptyTable, HeaderSort, TablePagination } from 'components/third-party/react-table';

import type { Pab } from '../types/index';

interface PabTableProps {
  table: TanStackTable<Pab>;
  data: Pab[];
  loading?: boolean;
  initialPageSize?: number;
}

// ==============================|| PAB TABLE ||============================== //

const PabTable = ({ table, data, loading = false, initialPageSize = 10 }: PabTableProps) => {
  // Render table
  const renderTable = () => {
    if (loading) {
      return <CircularLoader />;
    }

    if (data.length === 0) {
      return <EmptyTable msg="Không tìm thấy PAB nào" />;
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            headerMeta?.align === 'center' ? 'center' : headerMeta?.align === 'right' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                            {header.column.getCanSort() && <HeaderSort column={header.column} sort />}
                          </>
                        )}
                      </div>
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
                  <TableRow hover selected={row.getIsSelected()} sx={{ cursor: 'pointer' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
          <TablePagination
            setPageSize={table.setPageSize}
            setPageIndex={table.setPageIndex}
            getState={table.getState}
            getPageCount={table.getPageCount}
            initialPageSize={initialPageSize}
          />
        </div>
      )}
    </>
  );
};

export default PabTable;
