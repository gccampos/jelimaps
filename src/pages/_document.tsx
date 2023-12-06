import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import {
  experimental_extendTheme as extendTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const theme = extendTheme({
  cssVarPrefix: "md-demo",
});

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        ></script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
      </Head>
      <body>
        <CssVarsProvider theme={theme}>
          <Main />
        </CssVarsProvider>
        <Analytics />
        <NextScript />
      </body>
    </Html>
  );
}
