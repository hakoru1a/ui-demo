import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export type NumberFieldProps = MuiTextFieldProps;

const NumberField = forwardRef<HTMLDivElement, NumberFieldProps>((props, ref) => {
  return (
    <MuiTextField
      ref={ref}
      type="number"
      {...props}
      slotProps={{
        htmlInput: {
          ...props.slotProps?.htmlInput,
        },
        ...props.slotProps,
      }}
    />
  );
});

export default NumberField;

