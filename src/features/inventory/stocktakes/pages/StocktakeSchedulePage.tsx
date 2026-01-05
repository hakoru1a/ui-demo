// ==============================|| STOCKTAKE SCHEDULE PAGE ||============================== //

import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import StocktakeCalendar from '../components/StocktakeCalendar';
import { getMockStocktakes } from '../mock/mock';
import type { Stocktake } from '../types';
import { STOCKTAKE_URLS, WAREHOUSE_OPTIONS } from '../types/constants';

// ==============================|| STOCKTAKE SCHEDULE PAGE ||============================== //

const StocktakeSchedulePage = () => {
  const navigate = useNavigate();
  const [stocktakes] = useState<Stocktake[]>(getMockStocktakes());
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');

  // Handle view change
  const handleViewChange = useCallback((newView: string) => {
    if (['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek'].includes(newView)) {
      setView(newView as typeof view);
    }
  }, []);

  // Handle event click - navigate to detail or edit
  const handleEventClick = useCallback(
    (stocktake: Stocktake) => {
      // If completed, show detail (read-only), else allow edit
      if (stocktake.status === 'completed') {
        navigate(STOCKTAKE_URLS.DETAIL(stocktake.id));
      } else {
        navigate(STOCKTAKE_URLS.EDIT(stocktake.id));
      }
    },
    [navigate]
  );

  // Handle date select - create new stocktake
  const handleDateSelect = useCallback(
    (start: Date, end: Date) => {
      navigate(STOCKTAKE_URLS.NEW);
    },
    [navigate]
  );

  // Handle navigate back
  const handleNavigateBack = useCallback(() => {
    navigate(STOCKTAKE_URLS.LIST);
  }, [navigate]);

  // Handle create new stocktake
  const handleCreateNew = useCallback(() => {
    navigate(STOCKTAKE_URLS.NEW);
  }, [navigate]);

  return (
    <MainCard
      title="Lịch kiểm kê"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Warehouse Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="warehouse-filter-label">Lọc theo kho</InputLabel>
            <Select
              labelId="warehouse-filter-label"
              value={warehouseFilter}
              size="medium"
              onChange={(e) => setWarehouseFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả kho</MenuItem>
              {WAREHOUSE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Navigate Back */}
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleNavigateBack}>
            Quay lại
          </Button>

          {/* Create New Stocktake */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Lên lịch kiểm kê
          </Button>
        </Stack>
      }
    >
      <Box sx={{ mt: 2 }}>
        <StocktakeCalendar
          stocktakes={stocktakes}
          view={view}
          onViewChange={handleViewChange}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          warehouseFilter={warehouseFilter || undefined}
        />
      </Box>
    </MainCard>
  );
};

export default StocktakeSchedulePage;
