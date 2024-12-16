import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react';
import { ThemeProvider } from "next-themes";

import "@assets/main.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" enableSystem={true} attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
