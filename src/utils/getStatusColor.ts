import { Theme } from '@mui/material/styles';

import { StatusFilter } from 'types/status';

export function getStatusColorMap(theme: Theme): Record<StatusFilter, string> & {
  warning: string;
  success: string;
  error: string;
  default: string;
  primary: string;
} {
  return {
    [StatusFilter.ALL]: theme.palette.primary.main,
    [StatusFilter.ACTIVE]: theme.palette.success.main,
    [StatusFilter.INACTIVE]: theme.palette.error.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    default: theme.palette.grey[500],
    primary: theme.palette.primary.main
  };
}
