//import * as L from 'leaflet'
import { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import DefaultTemplate from "@/main/template/DefaultTemplate";
import { Grid } from "@mui/material";
import {
  MapaProvider,
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
// import ModoVisaoDialog from "@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog";
import { PinDrop } from "@mui/icons-material";

const ModoVisaoDialog = dynamic(
  () => import("@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog"),
  { ssr: false }
);
const Studio = dynamic(() => import("@/components/Studio"), {
  ssr: false,
});

export default function Mapa() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

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
