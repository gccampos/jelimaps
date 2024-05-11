"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

export default function Mapa() {
  const router = useRouter();
  const exemplos = useMemo(
    () => ["one-piece", "pequena-africa", "golpe-64", "novo"],
    []
  );

  useEffect(() => {
    if (
      router.query.id &&
      typeof router.query.id === "string" &&
      exemplos.includes(router.query.id)
    )
      if (typeof localStorage !== "undefined") {
        localStorage.clear();
        if (router.query.id !== "novo") {
          const su = require(`@/pages/examples/${router.query.id}.json`);
          localStorage.setItem("mapaContext", JSON.stringify(su));
        }
        router.push("/mapa");
      }
  }, [exemplos, router]);
  return null;
}
