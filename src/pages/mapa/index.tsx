"use client";
//import * as L from 'leaflet'
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";
import {
  MapaProvider,
  useMapaContext,
} from "@/components/Mapa/context/MapaContext";
import "subjx/dist/style/subjx.css";

const ModoVisaoDialog = dynamic(
  () => import("@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog"),
  { ssr: false }
);
const Studio = dynamic(() => import("@/components/Studio"), {
  ssr: false,
});

export default function Mapa() {
  const mapaContext = useMapaContext();
  useEffect(() => {
    console.log("duvidando de que", mapaContext);
  }, []);
  return (
    <main style={{ height: "100%" }}>
      <MapaProvider>
        <ModoVisaoDialog />
        <Studio />
      </MapaProvider>
    </main>
  );
}
