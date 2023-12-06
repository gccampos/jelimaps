import "@/styles/globals.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleAnalytics } from "nextjs-google-analytics";
import CaixaDialogoProvider from "@/components/CaixaDialogo/CaixaDialogoProvider";
import { BarraAlertaProvider } from "@/components/BarraAlerta/BarraAlertaProvider";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }) {
  console.log("teste", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
      <CaixaDialogoProvider />
      <BarraAlertaProvider />
      <Analytics />
    </>
  );
}
