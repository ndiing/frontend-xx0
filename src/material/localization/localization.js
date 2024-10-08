import { configureLocalization } from "@lit/localize";
import { sourceLocale, targetLocales } from "../../generated/locale-codes.js";

const { getLocale, setLocale } = configureLocalization({
    sourceLocale,
    targetLocales,
    loadLocale: (locale) => import(`../../generated/locales/${locale}.js`),
});

export { getLocale, setLocale };

// {
//     console.log(sourceLocale, targetLocales)
//     setLocale('zh-Hans')
//     console.log(getLocale())
// }
