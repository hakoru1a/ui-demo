// ==============================|| TIMEKEEPING LIST PAGE ||============================== //

import { CalculatorOutlined, DownloadOutlined, FileTextOutlined, LockOutlined, PlusOutlined, UnlockOutlined } from '@ant-design/icons';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import PayrollCalculationDialog from '../components/PayrollCalculationDialog';
import QuickTimekeepingDialog, { type QuickTimekeepingFormData } from '../components/QuickTimekeepingDialog';
import TimekeepingCalendar from '../components/TimekeepingCalendar';
import { mockShifts } from '../mock/shifts';
import { mockWorkHours } from '../mock/workHours';
import type { CalendarEventData, WorkHour, WorkShift } from '../types/index';
import { TIMEKEEPING_URLS } from '../types/index';
import type { PayrollCalculationResult } from '../utils/salaryCalculator';

// ==============================|| TIMEKEEPING LIST PAGE ||============================== //

const TimekeepingListPage = () => {
  const navigate = useNavigate();
  const [shifts] = useState<WorkShift[]>(mockShifts);
  const [workHours] = useState<WorkHour[]>(mockWorkHours);
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [employeeFilter, setEmployeeFilter] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [hasEnoughData] = useState<boolean>(true); // Mock: assume data is sufficient
  const [calculationDialogOpen, setCalculationDialogOpen] = useState(false);
  const [calculationResults, setCalculationResults] = useState<PayrollCalculationResult[]>([]);
  const [calculationPeriod, setCalculationPeriod] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Get unique employees for filter
  const employeeOptions = useMemo(() => {
    const employees = new Map<string, { id: string; name: string; code: string }>();
    shifts.forEach((shift) => {
      if (!employees.has(shift.employeeId)) {
        employees.set(shift.employeeId, {
          id: shift.employeeId,
          name: shift.employeeName,
          code: shift.employeeCode
        });
      }
    });
    return [
      { value: '', label: 'Tất cả nhân viên' },
      ...Array.from(employees.values()).map((emp) => ({
        value: emp.id,
        label: `${emp.code} - ${emp.name}`
      }))
    ];
  }, [shifts]);

  // Handle view change
  const handleViewChange = useCallback((newView: string) => {
    if (['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek'].includes(newView)) {
      setView(newView as typeof view);
    }
  }, []);

  // Handle event click - navigate based on view type
  const handleEventClick = useCallback(
    (data: CalendarEventData) => {
      if (view === 'dayGridMonth' && data.shift) {
        // Month view: View detail
        navigate(TIMEKEEPING_URLS.DETAIL(data.shift.id));
      } else if (view === 'timeGridWeek' && data.shift) {
        // Week view: Edit shift
        navigate(TIMEKEEPING_URLS.DETAIL(data.shift.id));
      } else if (view === 'timeGridDay' && data.hour) {
        // Day view: Quick add popup (already handled by date select)
        setSelectedDate(new Date(data.hour.workDate));
        setQuickAddOpen(true);
      }
    },
    [navigate, view]
  );

  // Handle event drop - update shift time (Week view only)
  const handleEventDrop = useCallback(
    (shift: WorkShift, newStart: Date) => {
      if (isLocked) {
        alert('Kỳ công đã bị khóa, không thể chỉnh sửa');
        return;
      }
      // Mock API call
      console.warn('Update shift time:', shift.id, newStart);
      alert(`Cập nhật thời gian cho ca của ${shift.employeeName} thành ${dateHelper.formatDateTime(newStart)} (Mock)`);
    },
    [isLocked]
  );

  // Handle date select - quick add (Day view)
  const handleDateSelect = useCallback(
    (start: Date, end: Date) => {
      if (isLocked) {
        alert('Kỳ công đã bị khóa, không thể thêm mới');
        return;
      }
      setSelectedDate(start);
      setQuickAddOpen(true);
    },
    [isLocked]
  );

  // Handle quick add submit
  const handleQuickAddSubmit = useCallback((data: QuickTimekeepingFormData) => {
    // Mock API call
    console.warn('Create timekeeping:', data);
    alert(`Thêm chấm công cho ${data.employeeName} ngày ${data.workDate} (Mock)`);
    setQuickAddOpen(false);
    setSelectedDate(null);
  }, []);

  // Handle manual timekeeping
  const handleManualTimekeeping = useCallback(() => {
    navigate(TIMEKEEPING_URLS.NEW);
  }, [navigate]);

  // Handle calculate salary
  const handleCalculateSalary = useCallback(() => {
    if (!hasEnoughData) {
      alert('Chưa đủ dữ liệu để tính lương. Vui lòng kiểm tra lại chấm công.');
      return;
    }

    setIsCalculating(true);

    // Get current period (current month)
    const now = new Date();
    const period = `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    // Get unique employee IDs from work hours
    const employeeMap = new Map<string, { code: string; name: string }>();
    workHours.forEach((hour) => {
      if (!employeeMap.has(hour.employeeId)) {
        employeeMap.set(hour.employeeId, {
          code: hour.employeeCode,
          name: hour.employeeName
        });
      }
    });

    const employeeIds = Array.from(employeeMap.keys());

    // Import salary calculator
    import('../utils/salaryCalculator').then(({ calculatePayrollsForPeriod }) => {
      const results = calculatePayrollsForPeriod(period, workHours, employeeIds, employeeMap);

      setIsCalculating(false);

      if (results.length === 0) {
        alert('Không có dữ liệu chấm công đã xác nhận để tính lương.');
        return;
      }

      // Show results in dialog
      setCalculationResults(results);
      setCalculationPeriod(period);
      setCalculationDialogOpen(true);
    });
  }, [hasEnoughData, workHours]);

  // Handle save payroll calculation
  const handleSavePayroll = useCallback(() => {
    // Mock API call to save payroll
    console.warn('Save payroll:', calculationResults);
    alert(`Đã lưu bảng lương cho ${calculationResults.length} nhân viên (Kỳ ${calculationPeriod}) - Mock`);
    setCalculationDialogOpen(false);
    setCalculationResults([]);
    setCalculationPeriod('');
  }, [calculationResults, calculationPeriod]);

  // Handle view salary table
  const handleViewSalaryTable = useCallback(() => {
    navigate('/timekeeping-payroll/payroll');
  }, [navigate]);

  // Handle export
  const handleExport = useCallback(() => {
    // Mock export to Excel
    console.warn('Export timekeeping table');
    alert('Xuất bảng công ra Excel (Mock)');
  }, []);

  // Handle lock period
  const handleLockPeriod = useCallback(() => {
    setLockDialogOpen(true);
  }, []);

  // Handle confirm lock
  const handleConfirmLock = useCallback(() => {
    setIsLocked(true);
    setLockDialogOpen(false);
    alert('Đã khóa kỳ công thành công (Mock)');
  }, []);

  // Handle unlock period
  const handleUnlockPeriod = useCallback(() => {
    setIsLocked(false);
    alert('Đã mở khóa kỳ công (Mock)');
  }, []);

  return (
    <>
      <MainCard
        title="Lịch chấm công & tính lương nhân công"
        secondary={
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {/* Employee Filter */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="employee-filter-label">Lọc theo nhân viên</InputLabel>
              <Select
                labelId="employee-filter-label"
                value={employeeFilter}
                label="Lọc theo nhân viên"
                onChange={(e) => setEmployeeFilter(e.target.value)}
              >
                {employeeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Action Buttons */}
            <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleManualTimekeeping} disabled={isLocked}>
              Chấm công thủ công
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<CalculatorOutlined />}
              onClick={handleCalculateSalary}
              disabled={!hasEnoughData || isLocked || isCalculating}
            >
              {isCalculating ? 'Đang tính...' : 'Tính lương'}
            </Button>

            <Button variant="outlined" startIcon={<FileTextOutlined />} onClick={handleViewSalaryTable}>
              Xem bảng lương
            </Button>

            <Button variant="outlined" startIcon={<DownloadOutlined />} onClick={handleExport}>
              Export bảng công
            </Button>

            {isLocked ? (
              <Button variant="outlined" color="warning" startIcon={<UnlockOutlined />} onClick={handleUnlockPeriod}>
                Mở khóa kỳ công
              </Button>
            ) : (
              <Button variant="outlined" color="warning" startIcon={<LockOutlined />} onClick={handleLockPeriod}>
                Khóa kỳ công
              </Button>
            )}
          </Stack>
        }
      >
        {isLocked && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Kỳ công đã bị khóa. Không thể chỉnh sửa hoặc thêm mới chấm công.
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <TimekeepingCalendar
            shifts={shifts}
            workHours={view === 'timeGridDay' ? workHours : undefined}
            view={view}
            onViewChange={handleViewChange}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onDateSelect={handleDateSelect}
            employeeFilter={employeeFilter || undefined}
            isLocked={isLocked}
          />
        </Box>
      </MainCard>

      {/* Quick Add Dialog */}
      <QuickTimekeepingDialog
        open={quickAddOpen}
        onClose={() => {
          setQuickAddOpen(false);
          setSelectedDate(null);
        }}
        onSubmit={handleQuickAddSubmit}
        initialDate={selectedDate || new Date()}
      />

      {/* Lock Period Dialog */}
      <ConfirmDialog
        open={lockDialogOpen}
        onClose={() => setLockDialogOpen(false)}
        onConfirm={handleConfirmLock}
        title="Khóa kỳ công"
        message="Bạn có chắc chắn muốn khóa kỳ công này? Sau khi khóa, không thể chỉnh sửa hoặc thêm mới chấm công."
        confirmText="Khóa"
        cancelText="Hủy"
        confirmColor="warning"
      />

      {/* Payroll Calculation Dialog */}
      <PayrollCalculationDialog
        open={calculationDialogOpen}
        onClose={() => {
          setCalculationDialogOpen(false);
          setCalculationResults([]);
          setCalculationPeriod('');
        }}
        onConfirm={handleSavePayroll}
        results={calculationResults}
        period={calculationPeriod}
        loading={false}
      />
    </>
  );
};

export default TimekeepingListPage;
