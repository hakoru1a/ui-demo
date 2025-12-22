import { Checkbox, FormControlLabel, type CheckboxProps, FormGroup, FormHelperText, FormControl } from '@mui/material';
import { forwardRef } from 'react';

export type CheckboxFieldProps = CheckboxProps & {
  label?: string;
  helperText?: string;
  error?: boolean;
};

const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>((props, ref) => {
  const { label, helperText, error, ...rest } = props;
  return (
    <FormControl error={error} component="fieldset" variant="standard">
      <FormGroup>
        <FormControlLabel control={<Checkbox ref={ref} {...rest} />} label={label} />
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
});

export default CheckboxField;
