//import * as L from 'leaflet'
import { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";

const Map = dynamic(() => import("./teste"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Mapa() {
  return (
    <main style={{ height: "100%" }}>
      <div>
        {" Aqui é o mapa "}
        <div style={{ height: "580px", display: "grid" }}>
          <Map />
        </div>
      </div>
    </main>
  );
}
