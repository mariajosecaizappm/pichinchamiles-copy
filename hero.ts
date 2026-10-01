import {heroui} from "@heroui/react";
import colors from "./src/presentation/style/colors";

export default heroui({
    themes: {
        light: {
            colors: {
                danger: {
                    DEFAULT: colors.error[500],
                    ...colors.error,
                },
                divider: {
                    DEFAULT: colors.darkGrayishBlue[300],
                    ...colors.darkGrayishBlue,
                },
                content3: {
                    DEFAULT: colors.darkGrayishBlue[200],
                    foreground: colors.darkGrayishBlue[700],
                },
                content4: {
                    DEFAULT: colors.darkGrayishBlue[300],
                    foreground: colors.darkGrayishBlue[800],
                },
                ...colors,
            },
        },
        dark: {
            colors: {
                danger: {
                    DEFAULT: colors.error[500],
                    ...colors.error,
                },
                divider: {
                    DEFAULT: colors.darkGrayishBlue[300],
                    ...colors.darkGrayishBlue,
                },
                content2: {
                    DEFAULT: colors.darkGrayishBlue[200],
                    foreground: colors.darkGrayishBlue[700],
                },
                ...colors,
            },
        },
    },
    defaultTheme: "light",
});
