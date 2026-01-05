// ==============================|| ADVANCE APPROVAL FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import { Field, useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

// types
import { APPROVAL_DECISION_OPTIONS } from '../types/constants';
import type { AdvanceApprovalFormData } from '../types/form';

// ==============================|| ADVANCE APPROVAL FORM ||============================== //

const AdvanceApprovalForm = () => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<AdvanceApprovalFormData>();

  const getError = (field: keyof AdvanceApprovalFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  // Check if comment is required (when decision is reject)
  const isCommentRequired = values.approvalDecision === 'reject';

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin phiếu tạm ứng */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin phiếu tạm ứng
        </Typography>
      </Grid>

      {/* Mã tạm ứng - Read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã tạm ứng"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
      </Grid>

      {/* Người đề nghị - Read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="requesterName"
          value={values.requesterName}
          label="Người đề nghị"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
      </Grid>

      {/* Số tiền - Read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="requestedAmount"
          value={values.requestedAmount}
          label="Số tiền"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
      </Grid>

      {/* Mục đích - Read-only */}
      <Grid size={12}>
        <RichField
          name="purpose"
          value={values.purpose}
          label="Mục đích"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
      </Grid>

      {/* Section: Quyết định phê duyệt */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          Quyết định phê duyệt
        </Typography>
      </Grid>

      {/* Quyết định - Required */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="approvalDecision"
          value={values.approvalDecision}
          onChange={(e) => {
            handleChange(e);
            // Clear comment when decision changes to approve
            if (e.target.value === 'approve') {
              setFieldValue('comment', '');
            }
          }}
          onBlur={handleBlur}
          label="Quyết định"
          fullWidth
          required
          error={!!getError('approvalDecision')}
          helperText={getError('approvalDecision')}
          options={APPROVAL_DECISION_OPTIONS}
        />
      </Grid>

      {/* Ngày duyệt - Required, Default: Today */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="approvalDate">
          {({ field, meta }: { field: { name: string; value: Date | string | null }; meta: { error?: string; touched?: boolean } }) => (
            <DatePickerField
              label="Ngày duyệt"
              value={field.value ? dateHelper.normalizeDateValue(field.value) : null}
              onChange={(newValue) => {
                setFieldValue(field.name, newValue ? newValue.toDate() : new Date());
              }}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: meta.touched && !!meta.error,
                  helperText: meta.touched && meta.error ? meta.error : undefined
                }
              }}
            />
          )}
        </Field>
      </Grid>

      {/* Ý kiến - Conditional (Required if reject) */}
      <Grid size={12}>
        <RichField
          name="comment"
          value={values.comment || ''}
          onChange={(e) => setFieldValue('comment', e.target.value)}
          onBlur={handleBlur}
          label="Ý kiến"
          fullWidth
          required={isCommentRequired}
          error={!!getError('comment')}
          helperText={getError('comment') || (isCommentRequired ? 'Bắt buộc khi từ chối' : undefined)}
          placeholder={isCommentRequired ? 'Vui lòng nhập lý do từ chối' : 'Nhập ý kiến (nếu có)'}
        />
      </Grid>

      {/* Status - Auto, hidden but included in form */}
      <Field name="status" type="hidden" />
    </Grid>
  );
};

export default AdvanceApprovalForm;
