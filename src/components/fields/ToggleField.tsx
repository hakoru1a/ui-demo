import { Switch, FormControlLabel, type SwitchProps, FormGroup, FormHelperText, FormControl } from '@mui/material';
import { forwardRef } from 'react';

export type ToggleFieldProps = SwitchProps & {
  label?: string;
  helperText?: string;
  error?: boolean;
};

const ToggleField = forwardRef<HTMLButtonElement, ToggleFieldProps>((props, ref) => {
  const { label, helperText, error, ...rest } = props;
  return (
    <FormControl error={error} component="fieldset" variant="standard">
      <FormGroup>
        <FormControlLabel control={<Switch ref={ref} {...rest} />} label={label} />
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
});

export default ToggleField;
