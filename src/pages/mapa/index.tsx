"use client";
//import * as L from 'leaflet'
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapaProvider } from "@/components/Mapa/MapaContext";

const ModoVisaoDialog = dynamic(
  () => import("@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog"),
  { ssr: false }
);
const Studio = dynamic(() => import("@/components/Studio"), {
  ssr: false,
});
type playerOpt = {
  name: string;
  stargazers_count: number;
};

export default function Mapa({ repo }: { repo?: playerOpt }) {
  return (
    <main style={{ height: "100%" }}>
      <MapaProvider>
        <ModoVisaoDialog />
        {repo == null && <Studio />}
      </MapaProvider>
    </main>
  );
}
