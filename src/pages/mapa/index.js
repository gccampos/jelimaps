//import * as L from 'leaflet'
import { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import DefaultTemplate from "@/main/template/DefaultTemplate";

export default function Mapa() {
  const Map = React.useMemo(
    () => dynamic(() => import("../../components/Mapa/teste"), {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }),
    []
  );
  return (
    <DefaultTemplate>
      <main style={{ height: "100%" }}>
        <div>
          <div style={{ height: "580px", display: "grid" }}>
            <Map />
          </div>
        </div>
      </main>
    </DefaultTemplate>
  );
}
