import { TextField, type TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export type RichFieldProps = TextFieldProps;

const RichField = forwardRef<HTMLDivElement, RichFieldProps>((props, ref) => {
  return <TextField multiline minRows={3} {...props} ref={ref} />;
});

export default RichField;

