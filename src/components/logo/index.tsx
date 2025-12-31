import ButtonBase from '@mui/material/ButtonBase';
import { SxProps } from '@mui/material/styles';
import { To } from 'history';
import { Link } from 'react-router-dom';

// material-ui

// project imports
import { APP_DEFAULT_PATH } from 'config';

import LogoIcon from './LogoIcon';
import Logo from './LogoMain';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps;
  to?: To;
}

export default function LogoSection({ reverse, isIcon, sx, to }: Props) {
  return (
    <ButtonBase disableRipple component={Link} to={to || APP_DEFAULT_PATH} sx={sx}>
      {isIcon ? <LogoIcon /> : <Logo reverse={reverse} />}
    </ButtonBase>
  );
}
