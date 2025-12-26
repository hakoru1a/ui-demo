import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { RouterProvider } from 'react-router-dom';

import 'dayjs/locale/vi';
// project imports

import Snackbar from 'components/@extended/Snackbar';
import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Notistack from 'components/third-party/Notistack';
// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import router from 'routes';
import ThemeCustomization from 'themes';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
              <ScrollTop>
                <AuthProvider>
                  <>
                    <Notistack>
                      <RouterProvider router={router} />
                      <Snackbar />
                    </Notistack>
                  </>
                </AuthProvider>
              </ScrollTop>
            </LocalizationProvider>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
    </>
  );
}
