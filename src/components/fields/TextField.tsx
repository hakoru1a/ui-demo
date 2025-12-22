import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export type TextFieldProps = MuiTextFieldProps;

const TextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  return <MuiTextField ref={ref} {...props} />;
});

export default TextField;
