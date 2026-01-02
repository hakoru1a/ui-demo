// ==============================|| PRODUCTION CALENDAR PAGE ||============================== //

import { UnorderedListOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { Stack, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import { getMockBatches } from '../../batches/mock/batches';
import type { Batch } from '../../batches/types';
import { BATCH_URLS } from '../../batches/types/constants';
import { PRODUCTION_LINE_OPTIONS } from '../../production-plans/types/constants';
import ProductionCalendar from '../components/ProductionCalendar';
import { getMockProductions } from '../mock/productions';
import { getMockShifts } from '../mock/shifts';
import type { ProductionShift, ShiftProduction, CalendarEventData } from '../types';
import { PRODUCTION_CALENDAR_URLS } from '../types/constants';

// ==============================|| PRODUCTION CALENDAR PAGE ||============================== //

const ProductionCalendarPage = () => {
  const navigate = useNavigate();
  const [batches] = useState<Batch[]>(getMockBatches());
  const [shifts] = useState<ProductionShift[]>(getMockShifts());
  const [productions] = useState<ShiftProduction[]>(getMockProductions());
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [batchFilter, setBatchFilter] = useState<string>('');
  const [productionLineFilter, setProductionLineFilter] = useState<string>('');

  // Get batch options for filter
  const batchOptions = useMemo(() => {
    return [
      { value: '', label: 'Tất cả lô' },
      ...batches.map((batch) => ({
        value: batch.id,
        label: `${batch.code} - ${batch.productName}`
      }))
    ];
  }, [batches]);

  // Get production line options for filter
  const productionLineOptions = useMemo(() => {
    return [{ value: '', label: 'Tất cả dây chuyền' }, ...PRODUCTION_LINE_OPTIONS];
  }, []);

  // Handle view change
  const handleViewChange = useCallback((newView: string) => {
    if (['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek'].includes(newView)) {
      setView(newView as typeof view);
    }
  }, []);

  // Handle event click - navigate based on view type
  const handleEventClick = useCallback(
    (data: CalendarEventData) => {
      if (view === 'dayGridMonth' && data.batch) {
        // Month view: View batch detail
        navigate(BATCH_URLS.DETAIL(data.batch.id));
      } else if ((view === 'timeGridWeek' || view === 'timeGridDay') && data.shift) {
        // Week/Day view: View shift detail
        navigate(PRODUCTION_CALENDAR_URLS.DETAIL(data.shift.id));
      }
    },
    [navigate, view]
  );

  // Handle event drop - update shift time
  const handleEventDrop = useCallback((shift: ProductionShift, newStart: Date) => {
    // Only allow drag for scheduled shifts
    if (shift.status !== 'scheduled') {
      alert('Chỉ có thể thay đổi thời gian cho ca đã lên lịch');
      return;
    }
    // Mock API call
    console.warn('Update shift time:', shift.id, newStart);
    alert(`Cập nhật thời gian cho ca ${shift.batchCode} thành ${dateHelper.formatDateTime(newStart)} (Mock)`);
  }, []);

  // Handle date select - create new shift
  const handleDateSelect = useCallback(
    (start: Date, end: Date) => {
      navigate(PRODUCTION_CALENDAR_URLS.NEW);
    },
    [navigate]
  );

  // Handle navigate to shift log
  const handleNavigateToShiftLog = useCallback(() => {
    navigate('/shift-logs');
  }, [navigate]);

  // Handle create new shift
  const handleCreateNew = useCallback(() => {
    navigate(PRODUCTION_CALENDAR_URLS.NEW);
  }, [navigate]);

  return (
    <MainCard
      title="Lịch & nhật ký sản lượng"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Batch Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="batch-filter-label">Lọc theo lô</InputLabel>
            <Select
              labelId="batch-filter-label"
              value={batchFilter}
              label="Lọc theo lô"
              onChange={(e) => setBatchFilter(e.target.value)}
              startAdornment={<FilterOutlined style={{ marginRight: 8 }} />}
            >
              {batchOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Production Line Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="line-filter-label">Lọc theo dây chuyền</InputLabel>
            <Select
              labelId="line-filter-label"
              value={productionLineFilter}
              label="Lọc theo dây chuyền"
              onChange={(e) => setProductionLineFilter(e.target.value)}
              startAdornment={<FilterOutlined style={{ marginRight: 8 }} />}
            >
              {productionLineOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Navigate to Shift Log */}
          <Button variant="outlined" startIcon={<UnorderedListOutlined />} onClick={handleNavigateToShiftLog}>
            Chuyển sang nhật ký ca
          </Button>

          {/* Create New Shift */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo ca mới
          </Button>
        </Stack>
      }
    >
      <Box sx={{ mt: 2 }}>
        <ProductionCalendar
          batches={batches}
          shifts={shifts}
          productions={productions}
          view={view}
          onViewChange={handleViewChange}
          onEventClick={handleEventClick}
          onEventDrop={handleEventDrop}
          onDateSelect={handleDateSelect}
          batchFilter={batchFilter || undefined}
          productionLineFilter={productionLineFilter || undefined}
        />
      </Box>
    </MainCard>
  );
};

export default ProductionCalendarPage;
