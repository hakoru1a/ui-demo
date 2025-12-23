// material-ui
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import { Box, Button, ClickAwayListener, Divider, IconButton, Paper, Popper, Stack } from '@mui/material';
// third-party
import type { ColumnFiltersState, Table } from '@tanstack/react-table';

// project imports
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';

// assets

// types
import useForestAreaFilter from '../hooks/useForestAreaFilter';
import type { ForestArea } from '../types';

// hooks

// ==============================|| FOREST AREA FILTER POPOVER ||============================== //

interface ForestAreaFilterProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  table: Table<ForestArea>;
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
}

export default function ForestAreaFilter({ open, onClose, anchorEl, table, columnFilters, onFilterChange }: ForestAreaFilterProps) {
  const { handleApply, handleReset, activeFilterCount } = useForestAreaFilter({
    columnFilters,
    onFilterChange,
    onClose,
    open
  });

  return (
    <Popper
      placement="bottom-end"
      open={open}
      anchorEl={anchorEl}
      transition
      disablePortal
      sx={{ zIndex: 1300, maxHeight: 'calc(100vh - 200px)' }}
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 9]
            }
          }
        ]
      }}
    >
      {({ TransitionProps }) => (
        <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
          <Paper
            elevation={8}
            sx={(theme) => ({
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0px 8px 24px rgba(0, 0, 0, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.3)'
                  : '0px 8px 24px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
              width: { xs: 'calc(100vw - 32px)', sm: 800, md: 1000 },
              maxWidth: 1200,
              maxHeight: 'calc(100vh - 200px)',
              overflow: 'auto',
              borderRadius: 2
            })}
          >
            <ClickAwayListener onClickAway={onClose}>
              <MainCard
                elevation={0}
                border={false}
                content={false}
                title={
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FilterOutlined />
                      <Box component="span">Bộ lọc</Box>
                      {activeFilterCount > 0 && (
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {activeFilterCount}
                        </Box>
                      )}
                    </Stack>
                    <IconButton size="small" onClick={onClose}>
                      <CloseOutlined />
                    </IconButton>
                  </Stack>
                }
              >
                <Divider />

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 2.5 }}>
                  <Button onClick={onClose} color="inherit" size="small">
                    Hủy
                  </Button>
                  <Button onClick={handleReset} color="error" variant="outlined" size="small">
                    Đặt lại
                  </Button>
                  <Button onClick={handleApply} variant="contained" color="primary" size="small">
                    Áp dụng
                  </Button>
                </Stack>
              </MainCard>
            </ClickAwayListener>
          </Paper>
        </Transitions>
      )}
    </Popper>
  );
}
