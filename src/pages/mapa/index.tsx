"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapaProvider } from "@/components/Mapa/MapaContext";
import Decider from "./decider";
import { useRouter } from "next/router";

const ModoVisaoDialog = dynamic(
  () => import("@/components/Mapa/ModoVisaoDialog/ModoVisaoDialog"),
  { ssr: false }
);
type Repo = {
  name: string;
  stargazers_count: number;
};

export default function Mapa(repo?: Repo) {
  const router = useRouter();
  if (repo?.name && typeof localStorage !== "undefined") {
    localStorage.clear();
    if (repo.name !== "novo") {
      const su = require(`@/pages/examples/${repo.name}.json`);
      localStorage.setItem("mapaContext", JSON.stringify(su));
    }
    router.push("/mapa");
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

export const getServerSideProps = async (context) => {
  const exemplos = ["one-piece", "pequena-africa", "novo"];
  for (let index = 0; index < exemplos.length; index++) {
    const element = exemplos[index];
    if (typeof context.query[element] !== "undefined")
      return { props: { name: element } };
  }
  // if(context.query['one-piece'])
  return { props: {} };
};
