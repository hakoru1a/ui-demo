import { Theme } from '@mui/material/styles';

import { StatusFilter } from 'types/status';

export function getStatusColorMap(theme: Theme): Record<StatusFilter, string> {
  return {
    [StatusFilter.ALL]: theme.palette.primary.main,
    [StatusFilter.ACTIVE]: theme.palette.success.main,
    [StatusFilter.INACTIVE]: theme.palette.error.main
  };
}
