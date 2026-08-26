import { ThemeProvider } from "next-themes";

import "@assets/main.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false} attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
