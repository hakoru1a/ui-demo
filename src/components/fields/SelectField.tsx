import { TextField, type TextFieldProps, MenuItem } from '@mui/material';
import { forwardRef } from 'react';

export type SelectFieldProps = TextFieldProps & {
  options: { label: string; value: string | number }[];
};

const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>((props, ref) => {
  const { options, ...rest } = props;
  return (
    <TextField select ref={ref} {...rest}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
});

export default SelectField;
