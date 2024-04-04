"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapaProvider } from "@/components/Mapa/MapaContext";
import Decider from "./decider";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const ModoVisaoDialog = dynamic(
  () => import("@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog"),
  { ssr: false }
);

export default function Mapa() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exemplos = ["one-piece", "pequena-africa", "golpe-64", "novo"];
  for (let index = 0; index < exemplos.length; index++) {
    const element = exemplos[index];
    if (searchParams.get(element) !== null)
      if (typeof localStorage !== "undefined") {
        localStorage.clear();
        if (element !== "novo") {
          const su = require(`@/pages/examples/${element}.json`);
          localStorage.setItem("mapaContext", JSON.stringify(su));
        }
        router.push("/mapa");
      }
  }
  return (
    <main style={{ height: "100%" }}>
      <MapaProvider>
        <ModoVisaoDialog />
        <Decider />
      </MapaProvider>
    </main>
  );
}
