import { Autocomplete, type AutocompleteProps, TextField } from '@mui/material';
import { forwardRef } from 'react';

export type AutocompleteFieldProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> = Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> & {
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
};

const AutocompleteField = forwardRef((props: Dynamic, ref) => {
  const { label, placeholder, error, helperText, ...rest } = props;

  return (
    <Autocomplete
      {...rest}
      ref={ref}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
});

export default AutocompleteField;

