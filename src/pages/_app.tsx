import "@/styles/globals.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleAnalytics } from "nextjs-google-analytics";
import CaixaDialogoProvider from "@/components/CaixaDialogo/CaixaDialogoProvider";
import { BarraAlertaProvider } from "@/components/BarraAlerta/BarraAlertaProvider";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
      <CaixaDialogoProvider />
      <BarraAlertaProvider />
    </>
  );
}
