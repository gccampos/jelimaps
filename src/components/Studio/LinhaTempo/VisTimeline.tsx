import React, { useEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline/standalone";
import { useMapaContext } from "@/components/Mapa/context/MapaContext";
import { elementoPadrao } from "@/components/Mapa/context/mapaContextTypes";

export default function VisTimeline(props: {
  listaElementos: elementoPadrao[];
}) {
  const mapaContext = useMapaContext();
  const [visTimeline, setVisTimeline] = useState<Timeline>(null);
  const visJsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visTimeline) {
      const items = props.listaElementos.map((x) => {
        return {
          id: x.id,
          content: x.nome,
          start: x.cenaInicio,
          end: x.cenaFim,
        };
      });
      const tl =
        visJsRef.current &&
        new Timeline(visJsRef.current, items, {
          editable: { remove: true, updateTime: true },
          groupEditable: true,
          zoomKey: "ctrlKey",
          start: mapaContext.cenaInicio,
          end: mapaContext.cenaFim,
        });
      setVisTimeline(tl);
    }
  }, [
    visJsRef,
    visTimeline,
    mapaContext.cenaFim,
    mapaContext.cenaInicio,
    props.listaElementos,
  ]);
  useEffect(() => {
    visTimeline &&
      visTimeline.setItems(
        props.listaElementos.map((x) => {
          return {
            id: x.id,
            content: x.nome,
            start: x.cenaInicio,
            end: x.cenaFim,
          };
        })
      );
  }, [visTimeline, props.listaElementos]);
  return (
    <div
      ref={visJsRef}
      className="personalized-scrollbar"
      style={{ overflowY: "scroll", height: "-webkit-fill-available" }}
    />
  );
}
