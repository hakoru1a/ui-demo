import { createContext, ReactElement } from 'react';

// project imports
import config, { MenuOrientation, ThemeDirection, ThemeMode } from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { CustomizationProps, FontFamily, I18n, PresetColor } from 'types/config';

// initial state
const initialState: CustomizationProps = {
  ...config,
  onChangeContainer: () => {},
  onChangeLocalization: () => {},
  onChangeMode: () => {},
  onChangePresetColor: () => {},
  onChangeDirection: () => {},
  onChangeMiniDrawer: () => {},
  onChangeThemeLayout: () => {},
  onChangeMenuOrientation: () => {},
  onChangeFontFamily: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactElement;
};

function ConfigProvider({ children }: ConfigProviderProps) {
  const [configState, setConfig] = useLocalStorage('mantis-react-ts-config', initialState);

  const onChangeContainer = (container: boolean) => {
    setConfig({
      ...configState,
      container: container
    });
  };

  const onChangeLocalization = (lang: I18n) => {
    setConfig({
      ...configState,
      i18n: lang
    });
  };

  const onChangeMode = (mode: ThemeMode) => {
    setConfig({
      ...configState,
      mode
    });
  };

  const onChangePresetColor = (theme: PresetColor) => {
    setConfig({
      ...configState,
      presetColor: theme
    });
  };

  const onChangeDirection = (direction: ThemeDirection) => {
    setConfig({
      ...config,
      themeDirection: direction
    });
  };

  const onChangeMiniDrawer = (miniDrawer: boolean) => {
    setConfig({
      ...config,
      miniDrawer
    });
  };

  const onChangeThemeLayout = (direction: ThemeDirection, miniDrawer: boolean) => {
    setConfig({
      ...config,
      miniDrawer,
      themeDirection: direction
    });
  };

  const onChangeMenuOrientation = (layout: MenuOrientation) => {
    setConfig({
      ...configState,
      menuOrientation: layout
    });
  };

  const onChangeFontFamily = (fontFamily: FontFamily) => {
    setConfig({
      ...configState,
      fontFamily
    });
  };

  return (
    <ConfigContext
      value={{
        ...configState,
        onChangeContainer,
        onChangeLocalization,
        onChangeMode,
        onChangePresetColor,
        onChangeDirection,
        onChangeMiniDrawer,
        onChangeThemeLayout,
        onChangeMenuOrientation,
        onChangeFontFamily
      }}
    >
      {children}
    </ConfigContext>
  );
}

export { ConfigProvider, ConfigContext };
