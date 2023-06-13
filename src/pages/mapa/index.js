//import * as L from 'leaflet'
import { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import DefaultTemplate from "@/main/template/DefaultTemplate";
import { Grid } from "@mui/material";
import { MapaProvider } from "@/main/context/MapaContext";

export default function Mapa() {
  const Map = React.useMemo(
    () =>
      dynamic(() => import("../../components/Mapa/teste"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    console.log("innerHeight", window.innerHeight);
    console.log("outerHeight", window.outerHeight);
  }, []);
  return (
    <DefaultTemplate>
      <main style={{ height: "100%" }}>
        <MapaProvider>
          <Grid container spacing={2} sx={{}}>
            <Grid item xs={0.5}>
              ola
            </Grid>
            <Grid item xs>
              <div style={{ height: "580px", display: "grid" }}>
                <Map />
              </div>
            </Grid>
            <Grid item xs={4}>
              ola
            </Grid>
            <Grid item xs={12}>
              ola
            </Grid>
          </Grid>
        </MapaProvider>
      </main>
    </DefaultTemplate>
  );
}
