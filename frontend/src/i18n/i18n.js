import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { translations } from "./translations";

const i18n = new I18n(translations);

// Установка языка по умолчанию
i18n.defaultLocale = "en";
// Установка текущего языка устройства
i18n.locale = Localization.locale;
// Включение отладочного режима
i18n.enableFallback = true;

export default i18n;
