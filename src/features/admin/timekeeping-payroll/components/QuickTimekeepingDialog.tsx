// ==============================|| QUICK TIMEKEEPING DIALOG ||============================== //

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { useState } from 'react';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import type { WorkShiftType } from '../types/index';
import { WORK_SHIFT_TYPE_OPTIONS } from '../types/index';

// ==============================|| TYPES ||============================== //

interface QuickTimekeepingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuickTimekeepingFormData) => void;
  initialDate?: Date;
  employeeId?: string;
  employeeName?: string;
}

export interface QuickTimekeepingFormData {
  employeeId: string;
  employeeName: string;
  shiftType: WorkShiftType;
  workDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

// ==============================|| QUICK TIMEKEEPING DIALOG ||============================== //

const QuickTimekeepingDialog = ({
  open,
  onClose,
  onSubmit,
  initialDate = new Date(),
  employeeId = '',
  employeeName = ''
}: QuickTimekeepingDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: QuickTimekeepingFormData = {
    employeeId,
    employeeName,
    shiftType: 'morning',
    workDate: dateHelper.formatDate(dayjs(initialDate), 'YYYY-MM-DD'),
    startTime: '08:00',
    endTime: '16:00',
    notes: ''
  };

  const handleSubmit = async (values: QuickTimekeepingFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Error submitting timekeeping:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
          <Form>
            <DialogTitle>
              <Typography variant="h4">Thêm nhanh chấm công</Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={12}>
                  <TextField
                    name="employeeName"
                    value={values.employeeName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Nhân viên"
                    fullWidth
                    required
                    placeholder="Nhập tên nhân viên"
                  />
                </Grid>
                <Grid size={12}>
                  <DatePickerField
                    value={values.workDate ? dayjs(values.workDate) : null}
                    onChange={(value) => {
                      const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : '';
                      setFieldValue('workDate', dateStr);
                    }}
                    label="Ngày làm việc"
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true
                      }
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <SelectField
                    name="shiftType"
                    value={values.shiftType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Loại ca"
                    fullWidth
                    required
                    options={WORK_SHIFT_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    name="startTime"
                    value={values.startTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Giờ bắt đầu"
                    fullWidth
                    required
                    type="time"
                    slotProps={{
                      input: {
                        step: 300 // 5 minutes
                      }
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    name="endTime"
                    value={values.endTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Giờ kết thúc"
                    fullWidth
                    required
                    type="time"
                    slotProps={{
                      input: {
                        step: 300 // 5 minutes
                      }
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    name="notes"
                    value={values.notes || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Ghi chú"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Thêm chấm công'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default QuickTimekeepingDialog;
