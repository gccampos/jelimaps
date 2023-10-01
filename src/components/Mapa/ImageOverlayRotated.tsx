import React, { useEffect } from "react";
import "leaflet-imageoverlay-rotated";
import L from "leaflet";
import { Marker, useMap } from "react-leaflet";
import { elementoComBounds } from "./context/mapaContextTypes";
import "leaflet-imageoverlay-rotated";
import { useMapaDispatch } from "./context/MapaContext";

type Props = {
  x: elementoComBounds;
  cliqueElementoNoMapa?: (elemento: any, evento: any) => void;
};

const ImageOverlayRotated = (props: Props) => {
  const { x, cliqueElementoNoMapa } = props;
  const map = useMap();
  const dispatch = useMapaDispatch();

  const reposition = (
    nomePropriedade: "positionTL" | "positionTR" | "positionBL",
    valorPropriedade: any
  ) => {
    dispatch({
      type: "editarPropriedade",
      id: x.id,
      tipo: "ImageOverlay",
      nomePropriedade,
      valorPropriedade,
    });
  };

  useEffect(() => {
    if ((L.imageOverlay as any).rotated) {
      const im = (L.imageOverlay as any).rotated(
        x.urlImagem,
        x.positionTL,
        x.positionTR,
        x.positionBL,
        {
          interactive: !!cliqueElementoNoMapa,
          ...x,
        }
      );
      map.addLayer(im);
      if (cliqueElementoNoMapa)
        im.on("click", (e) => cliqueElementoNoMapa(x, e));
      return () => {
        map.removeLayer(im);
        if (cliqueElementoNoMapa)
          im.off("click", (e) => cliqueElementoNoMapa(x, e));
      };
    }
  });
  return x.draggable ? (
    <>
      <Marker
        position={x.positionTL}
        draggable={x.draggable}
        eventHandlers={{
          move: (e: any) => reposition("positionTL", e.latlng),
        }}
      />
      <Marker
        position={x.positionTR}
        draggable={x.draggable}
        eventHandlers={{
          move: (e: any) => reposition("positionTR", e.latlng),
        }}
      />
      <Marker
        position={x.positionBL}
        draggable={x.draggable}
        eventHandlers={{
          move: (e: any) => reposition("positionBL", e.latlng),
        }}
      />
    </>
  ) : null;
  //(
  // <ImageOverlay
  //   {...x}
  //   ref={(e) => {
  //     imageRef.current = e;
  //   }}
  //   className={x.draggable ? "image-overlay-subjx " + x.id : ""}
  //   url={x.urlImagem}
  //   key={`ImageOverlay#${i}`}
  //   eventHandlers={{
  //     click: (e) => cliqueElementoNoMapa(x, e),
  //   }}
  // />
  // );
};

export default ImageOverlayRotated;
