import { Stack } from '@mui/material';
import { type ColumnDef } from '@tanstack/react-table';
import { memo } from 'react';

import ScrollX from 'components/ScrollX';

import { ForestArea } from '../types';

interface ForestAreaTableProps {
  data: ForestArea[];
  columns: ColumnDef<ForestArea>[];
  loading: boolean;
}

const ForestAreaTable = ({ data, columns, loading }: ForestAreaTableProps) => {
  return (
    <ScrollX>
      <Stack></Stack>
    </ScrollX>
  );
};

export default memo(ForestAreaTable);
