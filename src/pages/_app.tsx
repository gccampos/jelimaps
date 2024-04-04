import "@/styles/globals.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleAnalytics } from "nextjs-google-analytics";
import CaixaDialogoProvider from "@/components/CaixaDialogo/CaixaDialogoProvider";
import { BarraAlertaProvider } from "@/components/BarraAlerta/BarraAlertaProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Component {...pageProps} />
      </LocalizationProvider>
      <CaixaDialogoProvider />
      <BarraAlertaProvider />
    </>
  );
}
