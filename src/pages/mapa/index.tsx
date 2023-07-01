//import * as L from 'leaflet'
import { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import DefaultTemplate from "@/main/template/DefaultTemplate";
import { MapaProvider } from "@/components/Mapa/context/MapaContext";
// import ModoVisaoDialog from "@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog";

const ModoVisaoDialog = dynamic(
  () => import("@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog"),
  { ssr: false }
);
const Studio = dynamic(() => import("@/components/Studio"), {
  ssr: false,
});

export default function Mapa() {
  useEffect(() => {
    console.log("innerHeight", window.innerHeight);
    console.log("outerHeight", window.outerHeight);
  }, []);
  return (
    <DefaultTemplate>
      <main style={{ height: "100%" }}>
        <MapaProvider>
          <ModoVisaoDialog />
          <Studio />
        </MapaProvider>
      </main>
    </DefaultTemplate>
  );
}
