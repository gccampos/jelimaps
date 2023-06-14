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

const Map = dynamic(() => import("../../components/Mapa/teste"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});
const ModoVisaoDialog = dynamic(
  () => import("@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog"),
  { ssr: false }
);
const Elementos = dynamic(() => import("@/components/Studio/Elementos"), {
  ssr: false,
});
const Propriedades = dynamic(() => import("@/components/Studio/Propriedades"), {
  ssr: false,
});
const LinhaTempo = dynamic(() => import("@/components/Studio/LinhaTempo"), {
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
          <Grid container spacing={2} sx={{}}>
            <Elementos />
            <Map />
            <Propriedades />
            <LinhaTempo />
          </Grid>
        </MapaProvider>
      </main>
    </DefaultTemplate>
  );
}
