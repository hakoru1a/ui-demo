import createCache, { StylisPlugin } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useEffect, ReactNode } from 'react';

// material-ui

// third-party
import rtlPlugin from 'stylis-plugin-rtl';

// project imports
import { ThemeDirection } from 'config';
import useConfig from 'hooks/useConfig';

// ==============================|| RTL LAYOUT ||============================== //

interface Props {
  children: ReactNode;
}

export default function RTLLayout({ children }: Props) {
  const { themeDirection } = useConfig();

  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  const cacheRtl = createCache({
    key: themeDirection === ThemeDirection.RTL ? 'rtl' : 'css',
    prepend: true,
    stylisPlugins: themeDirection === ThemeDirection.RTL ? [rtlPlugin as StylisPlugin] : []
  });

  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}
