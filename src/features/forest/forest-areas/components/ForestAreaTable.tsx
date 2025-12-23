// material-ui
import DownOutlined from '@ant-design/icons/DownOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

// third-party
import { flexRender, type Row, type Table as TanStackTable } from '@tanstack/react-table';

// project imports
import CircularLoader from 'components/CircularLoader';
import ScrollX from 'components/ScrollX';
import { EmptyTable, HeaderSort, TablePagination } from 'components/third-party/react-table';

// assets

// types
import { ForestArea } from '../types';
import { CERTIFICATE_OPTIONS, TREE_TYPE_OPTIONS } from '../types/constants';

interface ForestAreaTableProps {
  table: TanStackTable<ForestArea>;
  data: ForestArea[];
  loading?: boolean;
  initialPageSize?: number;
}

// ==============================|| FOREST AREA TABLE ||============================== //

const ForestAreaTable = ({ table, data, loading = false, initialPageSize = 10 }: ForestAreaTableProps) => {
  // Get label from options array
  const getLabelFromOptions = <T extends string>(value: T | undefined, options: { value: T; label: string }[]): string => {
    if (!value) return '-';
    const option = options.find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Render expanded row content
  const renderExpandedRow = (row: Row<ForestArea>) => {
    const forestArea = row.original;

    return (
      <Box sx={{ py: 2, px: 3, backgroundColor: 'background.default' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Loại cây trồng
            </Typography>
            <Typography variant="body2">{getLabelFromOptions(forestArea.treeType, TREE_TYPE_OPTIONS)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Năm trồng
            </Typography>
            <Typography variant="body2">{forestArea.plantingYear || '-'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Chứng chỉ
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {forestArea.certificates && forestArea.certificates.length > 0 ? (
                forestArea.certificates.map((cert) => {
                  const certOption = CERTIFICATE_OPTIONS.find((opt) => opt.value === cert);
                  return (
                    <Typography key={cert} variant="body2" component="span">
                      {certOption?.label || cert}
                      {forestArea.certificates.indexOf(cert) < forestArea.certificates.length - 1 ? ', ' : ''}
                    </Typography>
                  );
                })
              ) : (
                <Typography variant="body2">-</Typography>
              )}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ghi chú
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 300 }}>
              {forestArea.notes || '-'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render table
  const renderTable = () => {
    if (loading) {
      return <CircularLoader />;
    }

    if (data.length === 0) {
      return <EmptyTable msg="No forest areas found" />;
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
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent={headerMeta?.align === 'center' ? 'center' : 'flex-start'}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                            {header.column.getCanSort() && <HeaderSort column={header.column} sort />}
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const isExpanded = row.getIsExpanded();

              return (
                <>
                  <TableRow
                    key={row.id}
                    hover
                    selected={row.getIsSelected()}
                    onClick={() => row.toggleExpanded()}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          row.toggleExpanded();
                        }}
                      >
                        {isExpanded ? <DownOutlined /> : <RightOutlined />}
                      </IconButton>
                    </TableCell>
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
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length + 1} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          {renderExpandedRow(row)}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </>
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
        <Stack alignItems="center" sx={{ p: 2 }}>
          <TablePagination
            setPageSize={table.setPageSize}
            setPageIndex={table.setPageIndex}
            getState={table.getState}
            getPageCount={table.getPageCount}
            initialPageSize={initialPageSize}
          />
        </Stack>
      )}
    </>
  );
};

export default ForestAreaTable;
