// material-ui
import { Box, Grid, Stack, Typography } from '@mui/material';

// types
import { ForestArea } from '../types';
import { CERTIFICATE_OPTIONS, TREE_TYPE_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

// ==============================|| FOREST AREA EXPANDED ROW ||============================== //

interface ForestAreaExpandedRowProps {
  forestArea: ForestArea;
}

const ForestAreaExpandedRow = ({ forestArea }: ForestAreaExpandedRowProps) => {
  return (
    <Box sx={{ py: 2, px: 3, backgroundColor: 'background.default' }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Loại cây trồng
          </Typography>
          <Typography variant="body2">{getLabelFromOptions(forestArea.treeType, TREE_TYPE_OPTIONS)}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Năm trồng
          </Typography>
          <Typography variant="body2">{forestArea.plantingYear || '-'}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Chứng chỉ
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {forestArea.certificates && forestArea.certificates.length > 0 ? (
              forestArea.certificates.map((cert) => {
                const certOption = CERTIFICATE_OPTIONS.find((opt) => opt.value === cert);
                return (
                  <Typography key={cert} variant="body2" component="span">
                    {certOption?.label || cert}
                    {forestArea.certificates.indexOf(cert) < forestArea.certificates.length - 1 ? ', ' : ''}
                  </Typography>
                );
              })
            ) : (
              <Typography variant="body2">-</Typography>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Ghi chú
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 300 }}>
            {forestArea.notes || '-'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForestAreaExpandedRow;
