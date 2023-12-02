import React, { useEffect } from "react";
import "leaflet-imageoverlay-rotated";
import L, { Bounds, LatLng } from "leaflet";
import { Marker, useMap } from "react-leaflet";
import { elementoComBounds } from "./mapaContextTypes";
import { useMapaContext, useMapaDispatch } from "./MapaContext";
import "leaflet.path.drag";
import "leaflet-imageoverlay-rotated";

type Props = {
  x: elementoComBounds;
  cliqueElementoNoMapa?: (elemento: any, evento: any) => void;
};

const ImageOverlayRotated = (props: Props) => {
  const { x, cliqueElementoNoMapa } = props;
  const map = useMap();
  const dispatch = useMapaDispatch();
  const mapaContext = useMapaContext();
  const centerUpdated = new LatLng(
    new Bounds(
      [x.positionTR[1], x.positionTR[0]],
      [x.positionBL[1], x.positionBL[0]]
    ).getCenter().y,
    new Bounds(
      [x.positionTR[1], x.positionTR[0]],
      [x.positionBL[1], x.positionBL[0]]
    ).getCenter().x
  );

  const reposition = (
    nomePropriedade: "positionTL" | "positionTR" | "positionBL",
    valorPropriedade: any
  ) => {
    dispatch({
      type: "editarPropriedade",
      id: x.id,
      tipo: "ImageOverlay",
      nomePropriedade,
      valorPropriedade: [valorPropriedade.lat, valorPropriedade.lng],
    });
  };
  const repositionCenter = (valorPropriedade: any) => {
    const diffLat =
      (centerUpdated ?? valorPropriedade.oldLatLng).lat -
      valorPropriedade.latlng.lat;
    const diffLng =
      (centerUpdated ?? valorPropriedade.oldLatLng).lng -
      valorPropriedade.latlng.lng;
    const diffPositions = {
      positionTL: [x.positionTL[0] - diffLat, x.positionTL[1] - diffLng],
      positionTR: [x.positionTR[0] - diffLat, x.positionTR[1] - diffLng],
      positionBL: [x.positionBL[0] - diffLat, x.positionBL[1] - diffLng],
    };
    dispatch({
      type: "movendoImagem",
      id: x.id,
      valor: diffPositions,
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
          bubblingMouseEvents: false,
          ...x,
        }
      );
      map.addLayer(im);
      // else map.addLayer(im);
      if (cliqueElementoNoMapa)
        im.on("click", (e) => cliqueElementoNoMapa(x, e));
      return () => {
        map.removeLayer(im);
        if (cliqueElementoNoMapa)
          im.off("click", (e) => cliqueElementoNoMapa(x, e));
      };
    }
  });

  return (x.draggable &&
    mapaContext.elementosFoco &&
    mapaContext.elementosFoco.length > 0 &&
    mapaContext.elementosFoco?.some((z) => z.id === x.id)) ||
    mapaContext.elementoFoco?.id === x.id ? (
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
      <Marker
        position={centerUpdated}
        draggable={x.draggable}
        eventHandlers={{
          move: (e: any) => repositionCenter(e),
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
