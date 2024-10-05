import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/globalCSS";
import LoadingScreen from "./pages/landing/LoadingScreen";
import App from "./App.jsx";
import "./index.css";

const theme = {
  primary: "#337ab7",
  secondary: "#285f8f",
  focus: "#63a0d4",
};

createRoot(document.getElementById("root")).render(
  <Suspense fallback={<LoadingScreen />}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </Suspense>
);
