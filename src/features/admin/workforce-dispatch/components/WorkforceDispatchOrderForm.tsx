// ==============================|| WORKFORCE DISPATCH ORDER FORM COMPONENT ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { Box, Button, Card, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import dayjs from 'dayjs';
import { Field, type FieldProps, useFormikContext } from 'formik';
import { useCallback, useMemo } from 'react';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { getMockEmployees } from '../../hr/mock/employees';
import type { Department } from '../../hr/types';
import { DEPARTMENT_OPTIONS, FACTORY_OPTIONS, PRODUCTION_SHIFT_OPTIONS, ROLE_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import type { DispatchPersonnelFormData, WorkforceDispatchOrderFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface WorkforceDispatchOrderFormProps {
  mode: FormMode;
}

// ==============================|| WORKFORCE DISPATCH ORDER FORM ||============================== //

const WorkforceDispatchOrderForm = ({ mode }: WorkforceDispatchOrderFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<WorkforceDispatchOrderFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof WorkforceDispatchOrderFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  const getPersonnelError = (index: number, field: keyof DispatchPersonnelFormData): string | undefined => {
    const personnelError = errors.personnel;
    if (Array.isArray(personnelError) && personnelError[index]) {
      const itemError = personnelError[index] as Record<string, unknown> | undefined;
      if (itemError && typeof itemError === 'object' && field in itemError) {
        return itemError[field] as string | undefined;
      }
    }
    return undefined;
  };

  // Get employees filtered by department
  const employeeOptions = useMemo(() => {
    const allEmployees = getMockEmployees().filter((emp) => emp.status === 'active');
    if (!values.departmentId) return allEmployees;

    // Map departmentId to department enum
    const departmentMap: Record<string, Department> = {
      'dept-001': 'production',
      'dept-002': 'warehouse',
      'dept-003': 'qc'
    };
    const department = departmentMap[values.departmentId];

    if (!department) return allEmployees;
    return allEmployees.filter((emp) => emp.department === department);
  }, [values.departmentId]);

  // Handle add personnel
  const handleAddPersonnel = useCallback(() => {
    const newPersonnel: DispatchPersonnelFormData = {
      personnelId: '',
      role: 'worker',
      note: ''
    };
    setFieldValue('personnel', [...values.personnel, newPersonnel]);
  }, [values.personnel, setFieldValue]);

  // Handle remove personnel
  const handleRemovePersonnel = useCallback(
    (index: number) => {
      const newPersonnel = values.personnel.filter((_, i) => i !== index);
      setFieldValue('personnel', newPersonnel);
    },
    [values.personnel, setFieldValue]
  );

  // Handle personnel field change
  const handlePersonnelFieldChange = useCallback(
    (index: number, field: keyof DispatchPersonnelFormData, value: unknown) => {
      const newPersonnel = [...values.personnel];
      newPersonnel[index] = { ...newPersonnel[index], [field]: value };
      setFieldValue('personnel', newPersonnel);
    },
    [values.personnel, setFieldValue]
  );

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã lệnh điều phối - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã lệnh điều phối"
          placeholder="Tự động tạo"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          helperText={mode === 'create' ? 'Mã sẽ được tự động tạo khi lưu' : undefined}
        />
      </Grid>

      {/* Ngày áp dụng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          value={values.applicationDate ? dayjs(values.applicationDate) : null}
          onChange={(value) => {
            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
            setFieldValue('applicationDate', dateStr);
          }}
          label="Ngày áp dụng"
          error={!!getError('applicationDate')}
          helperText={getError('applicationDate') || undefined}
          slotProps={{
            textField: {
              required: true,
              fullWidth: true,
              inputProps: {
                readOnly: isReadOnly
              }
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Nhà máy */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="factoryId"
          value={values.factoryId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Nhà máy"
          fullWidth
          required
          error={!!getError('factoryId')}
          helperText={getError('factoryId')}
          options={FACTORY_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ca sản xuất */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="productionShiftId"
          value={values.productionShiftId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Ca sản xuất"
          fullWidth
          required
          error={!!getError('productionShiftId')}
          helperText={getError('productionShiftId')}
          options={PRODUCTION_SHIFT_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Bộ phận */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="departmentId"
          value={values.departmentId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Bộ phận"
          fullWidth
          required
          error={!!getError('departmentId')}
          helperText={getError('departmentId')}
          options={DEPARTMENT_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Trạng thái */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="status"
          value={values.status}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Trạng thái"
          fullWidth
          required
          error={!!getError('status')}
          helperText={getError('status')}
          options={STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Danh sách nhân sự */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Danh sách nhân sự ({values.personnel.length})
          </Typography>
          {!isReadOnly && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<PlusOutlined />}
              onClick={handleAddPersonnel}
              disabled={!values.departmentId}
            >
              Thêm nhân sự
            </Button>
          )}
        </Stack>
      </Grid>

      {/* Personnel Items */}
      {values.personnel.length === 0 ? (
        <Grid size={12}>
          <Box sx={{ p: 3, textAlign: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có nhân sự nào. Vui lòng thêm nhân sự.
            </Typography>
          </Box>
        </Grid>
      ) : (
        values.personnel.map((personnel, index) => (
          <Grid size={12} key={personnel.personnelId || `personnel-${index}`}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Nhân sự #{index + 1}
                </Typography>
                {!isReadOnly && (
                  <IconButton size="small" color="error" onClick={() => handleRemovePersonnel(index)}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </Stack>

              <Grid container spacing={2}>
                {/* Nhân sự */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  {isReadOnly ? (
                    <Typography variant="body2">
                      {employeeOptions.find((emp) => emp.id === personnel.personnelId)?.fullName || '-'}
                    </Typography>
                  ) : (
                    <Field name={`personnel.${index}.personnelId`}>
                      {({ field }: FieldProps) => (
                        <Autocomplete
                          value={employeeOptions.find((opt) => opt.id === field.value) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.id || '');
                            handlePersonnelFieldChange(index, 'personnelId', newValue?.id || '');
                          }}
                          options={employeeOptions}
                          getOptionLabel={(option) => `${option.code} - ${option.fullName}`}
                          isOptionEqualToValue={(option, val) => option.id === val.id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Nhân sự"
                              placeholder="Chọn nhân sự"
                              required
                              error={!!getPersonnelError(index, 'personnelId')}
                              helperText={getPersonnelError(index, 'personnelId')}
                            />
                          )}
                        />
                      )}
                    </Field>
                  )}
                </Grid>

                {/* Vai trò */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  {isReadOnly ? (
                    <Typography variant="body2">{ROLE_OPTIONS.find((opt) => opt.value === personnel.role)?.label || '-'}</Typography>
                  ) : (
                    <SelectField
                      value={personnel.role}
                      onChange={(e) => handlePersonnelFieldChange(index, 'role', e.target.value)}
                      label="Vai trò"
                      fullWidth
                      required
                      options={ROLE_OPTIONS}
                      error={!!getPersonnelError(index, 'role')}
                      helperText={getPersonnelError(index, 'role')}
                    />
                  )}
                </Grid>

                {/* Ghi chú */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  {isReadOnly ? (
                    <Typography variant="body2">{personnel.note || '-'}</Typography>
                  ) : (
                    <RichField
                      value={personnel.note || ''}
                      onChange={(e) => handlePersonnelFieldChange(index, 'note', e.target.value)}
                      label="Ghi chú"
                      placeholder="Nhập ghi chú (tùy chọn)"
                      fullWidth
                      minRows={2}
                      error={!!getPersonnelError(index, 'note')}
                      helperText={getPersonnelError(index, 'note')}
                      slotProps={{
                        input: {
                          readOnly: isReadOnly
                        }
                      }}
                      sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
                    />
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))
      )}
      {touched.personnel && errors.personnel && typeof errors.personnel === 'string' && (
        <Grid size={12}>
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
            {errors.personnel}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default WorkforceDispatchOrderForm;
