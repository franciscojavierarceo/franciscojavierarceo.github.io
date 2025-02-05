const defaultSans = [
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  '"Noto Sans"',
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

const defaultSerif = [
  "Georgia",
  "Cambria",
  '"Times New Roman"',
  "Times",
  "serif",
];

module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,css}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "neon-orange": "#f92300",
        "dark-bg": "#000000",
      },
      fontSize: {
        "7xl": "4.5rem",
      },
      spacing: {
        14: "3.375rem",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            blockquote: {
              borderLeftColor: theme("colors.gray.700"),
            },
            "ol > li::before": {
              color: theme("colors.gray.700"),
            },
            "ul > li::before": {
              backgroundColor: theme("colors.gray.700"),
            },
            a: {
              color: theme("colors.neon-orange"),
            },
          },
        },

        dark: {
          css: {
            color: theme("colors.white"),
            backgroundColor: theme("colors.dark-bg"),
            blockquote: {
              borderLeftColor: theme("colors.gray.300"),
            },
            "ol > li::before": {
              color: theme("colors.gray.300"),
            },
            "ul > li::before": {
              backgroundColor: theme("colors.gray.300"),
            },
            a: {
              color: theme("colors.yellow.500"),
            },
            h1: {
              color: theme("colors.white"),
            },
            h2: {
              color: theme("colors.white"),
            },
            h3: {
              color: theme("colors.white"),
            },
            h4: {
              color: theme("colors.white"),
            },
            h5: {
              color: theme("colors.white"),
            },
            h6: {
              color: theme("colors.white"),
            },
            strong: {
              color: theme("colors.white"),
            },
            code: {
              color: theme("colors.white"),
            },
            figcaption: {
              color: theme("colors.white"),
            },
            blockquote: {
              color: theme("colors.white"),
              borderLeftColor: theme("colors.gray.200"),
            },
          },
        },
      }),
    },
    fontFamily: {
      // display: ["Open Sans", ...defaultSans],
      // body: ["Merriweather", ...defaultSerif],
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
  variants: {
    extend: {
      typography: ["dark"],
    },
  },
};
