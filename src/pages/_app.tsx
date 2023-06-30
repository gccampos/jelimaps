import '@/styles/globals.css'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function App({ Component, pageProps }) {
  return   <><GoogleAnalytics trackPageViews /><Component {...pageProps} /></>
}
