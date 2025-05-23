import AppNav from "./src/navigation/AppNav";
import { useColorScheme } from "react-native";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import "react-native-gesture-handler";
import { LightScheme } from "./src/theme/lightScheme";
import { DarkScheme } from "./src/theme/darkScheme";
import { StatusBar } from "expo-status-bar";
import { I18nProvider } from "./src/i18n/I18nProvider";

import {
  fontBold,
  fontLight,
  fontMedium,
  fontRegular,
  fontThin,
} from "./src/constants/Fonts";
import { AuthProvider } from "./src/context/AuthContext";
import { white } from "./src/constants/Colors";

const App = () => {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    fontBold,
    fontRegular,
    fontMedium,
    fontLight,
    fontThin,
  });

  if (!fontsLoaded) {
    return null;
  }

  const LightTheme = {
    ...MD3LightTheme,
    colors: LightScheme,
  };

  const DarkTheme = {
    ...MD3DarkTheme,
    colors: DarkScheme,
  };

  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return (
    <I18nProvider>
      <PaperProvider settings={{ rippleEffectEnabled: false }}>
        <AuthProvider>
          <AppNav />
          <StatusBar backgroundColor={white} />
        </AuthProvider>
      </PaperProvider>
    </I18nProvider>
  );
};

export default App;
