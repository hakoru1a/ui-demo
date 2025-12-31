// ==============================|| DISPATCHING SCHEDULE PAGE ||============================== //

import { UnorderedListOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { Stack, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import { getMockVehicles } from '../../fleet/mock/vehicles';
import DispatchOrderCalendar from '../components/DispatchOrderCalendar';
import { getMockDispatchOrders } from '../mock/dispatchOrders';
import type { DispatchOrder } from '../types';
import { DISPATCH_ORDER_URLS } from '../types/constants';

// ==============================|| DISPATCHING SCHEDULE PAGE ||============================== //

const DispatchingSchedulePage = () => {
  const navigate = useNavigate();
  const [orders] = useState<DispatchOrder[]>(getMockDispatchOrders());
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [vehicleFilter, setVehicleFilter] = useState<string>('');

  // Get vehicle options for filter
  const vehicleOptions = useMemo(() => {
    const vehicles = getMockVehicles();
    return [
      { value: '', label: 'Tất cả xe' },
      ...vehicles.map((v) => ({
        value: v.id,
        label: `${v.licensePlate} - ${v.driverName}`
      }))
    ];
  }, []);

  // Handle view change
  const handleViewChange = useCallback((newView: string) => {
    if (['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek'].includes(newView)) {
      setView(newView as typeof view);
    }
  }, []);

  // Handle event click - navigate to detail
  const handleEventClick = useCallback(
    (order: DispatchOrder) => {
      // If running, show detail (read-only), else allow edit
      if (order.status === 'running') {
        navigate(DISPATCH_ORDER_URLS.DETAIL(order.id));
      } else {
        navigate(DISPATCH_ORDER_URLS.EDIT(order.id));
      }
    },
    [navigate]
  );

  // Handle event drop - update order departure time
  const handleEventDrop = useCallback((order: DispatchOrder, newStart: Date) => {
    // Only allow drag for non-running orders
    if (order.status === 'running') {
      alert('Không thể thay đổi lịch cho lệnh đang chạy');
      return;
    }
    // Mock API call
    console.warn('Update order departure time:', order.id, newStart);
    alert(`Cập nhật thời gian xuất phát cho lệnh ${order.orderCode} thành ${dateHelper.formatDateTime(newStart)} (Mock)`);
  }, []);

  // Handle date select - create new order
  const handleDateSelect = useCallback(
    (start: Date, end: Date) => {
      navigate(DISPATCH_ORDER_URLS.NEW);
    },
    [navigate]
  );

  // Handle navigate to list
  const handleNavigateToList = useCallback(() => {
    navigate(DISPATCH_ORDER_URLS.LIST);
  }, [navigate]);

  // Handle create new order
  const handleCreateNew = useCallback(() => {
    navigate(DISPATCH_ORDER_URLS.NEW);
  }, [navigate]);

  return (
    <MainCard
      title="Lịch điều động vận chuyển"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Vehicle Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="vehicle-filter-label">Lọc theo xe</InputLabel>
            <Select
              labelId="vehicle-filter-label"
              value={vehicleFilter}
              label="Lọc theo xe"
              onChange={(e) => setVehicleFilter(e.target.value)}
              startAdornment={<FilterOutlined style={{ marginRight: 8 }} />}
            >
              {vehicleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Navigate to List */}
          <Button variant="outlined" startIcon={<UnorderedListOutlined />} onClick={handleNavigateToList}>
            Chuyển sang danh sách
          </Button>

          {/* Create New Order */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo lệnh mới
          </Button>
        </Stack>
      }
    >
      <Box sx={{ mt: 2 }}>
        <DispatchOrderCalendar
          orders={orders}
          view={view}
          onViewChange={handleViewChange}
          onEventClick={handleEventClick}
          onEventDrop={handleEventDrop}
          onDateSelect={handleDateSelect}
          vehicleFilter={vehicleFilter || undefined}
        />
      </Box>
    </MainCard>
  );
};

export default DispatchingSchedulePage;
