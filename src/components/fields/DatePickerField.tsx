import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { forwardRef, type ComponentProps } from 'react';

export type DatePickerFieldProps = ComponentProps<typeof DatePicker> & {
  error?: boolean;
  helperText?: string;
};

const DatePickerField = forwardRef<HTMLDivElement, DatePickerFieldProps>((props, ref) => {
  const { slotProps, error, helperText, ...rest } = props;

  return (
    <DatePicker
      {...rest}
      ref={ref}
      slotProps={{
        ...slotProps,
        textField: {
          ...slotProps?.textField,
          error: error,
          helperText: helperText
        }
      }}
    />
  );
});

export default DatePickerField;
