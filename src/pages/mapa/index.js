//import * as L from 'leaflet'
import { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import DefaultTemplate from "@/main/template/DefaultTemplate";

const Map = dynamic(() => import("./teste"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Mapa() {
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
