import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import {
  experimental_extendTheme as extendTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles";

const theme = extendTheme({
  cssVarPrefix: "md-demo",
});

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <CssVarsProvider theme={theme}>
          <Main />
        </CssVarsProvider>
        <NextScript />
      </body>
    </Html>
  );
}
