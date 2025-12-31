// material-ui
import CameraOutlined from '@ant-design/icons/CameraOutlined';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import UploadCover from 'assets/images/upload/upload.svg';
import { DropzoneType } from 'config';

// assets

// ==============================|| UPLOAD - PLACEHOLDER ||============================== //

export default function PlaceholderContent({ type }: { type?: DropzoneType }) {
  return (
    <>
      {type !== DropzoneType.STANDARD && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', width: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          <CardMedia component="img" image={UploadCover} sx={{ width: 150 }} />
          <Stack sx={{ gap: 1, p: 3 }}>
            <Typography variant="h5">Drag & Drop or Select file</Typography>

            <Typography color="secondary">
              Drop files here or click&nbsp;
              <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                browse
              </Typography>
              &nbsp;thorough your machine
            </Typography>
          </Stack>
        </Stack>
      )}
      {type === DropzoneType.STANDARD && (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 1 }}>
          <CameraOutlined style={{ fontSize: '32px' }} />
        </Stack>
      )}
    </>
  );
}
