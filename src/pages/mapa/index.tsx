"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapaProvider } from "@/components/Mapa/MapaContext";
import Decider from "./decider";

const ModoVisaoDialog = dynamic(
  () => import("@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog"),
  { ssr: false }
);

export default function Mapa() {
  return (
    <main style={{ height: "100%" }}>
      <MapaProvider>
        <ModoVisaoDialog />
        <Decider />
      </MapaProvider>
    </main>
  );
}
