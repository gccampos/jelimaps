import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  ImageOverlay,
  useMap,
} from "react-leaflet";
import { LatLngBounds, LatLng } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import CustomControlLeaftlet from "@/components/CustomControlLeaftlet/CustomControlLeaftlet";
import dynamic from "next/dynamic";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Grid } from "@mui/material";

export const MODO_VISAO = {
  openstreetmap: "OpenStreetMap",
  mapaProprio: "Mapa Próprio",
};

function isControlLeafLet(node) {
  return node.className.includes("leaflet-control")
    ? node.className.includes("leaflet-control")
    : node.className.includes("leaflet-container")
    ? !node.className.includes("leaflet-container")
    : node.parentElement
    ? isControlLeafLet(node.parentElement)
    : false;
}

export default function Teste() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [map, setMap] = useState(null);
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const position = useMemo(
    () =>
      mapaContext.modoVisao === MODO_VISAO.openstreetmap
        ? [-22.906659526195618, -43.1333403313017]
        : [0.5, 0.75],
    [mapaContext.modoVisao]
  );

  function LocationMarker() {
    useMapEvents(
      mapaContext?.elemento?.nome === "pin"
        ? {
            click(e) {
              console.log(e.latlng);
              if (!isControlLeafLet(e.originalEvent.target))
                dispatch({
                  type: "elementos",
                  arg: mapaContext.elemento.nome,
                  posicao: e.latlng,
                });
            },
          }
        : {}
    );

    return mapaContext?.elemento?.posicao != null ? (
      <Marker position={mapaContext.elemento.posicao}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null;
  }
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const center = useMemo(
    () => new LatLng(position[0], position[1]),
    [position]
  );
  const zoom = mapaContext.modoVisao === MODO_VISAO.openstreetmap ? 15 : 9;
  useEffect(() => {
    console.log(center);
    if (map != null) map.setView(center, zoom);
  }, [mapaContext.modoVisao, map, center, zoom]);

  const bounds = new LatLngBounds([0, 0], [1, 1.5]);

  return (
    isMounted && (
      <Grid item xs>
        <div style={{ height: "580px", display: "grid" }}>
          <MapContainer center={center} zoom={zoom} ref={setMap} maxZoom={18}>
            {mapaContext.modoVisao === MODO_VISAO.openstreetmap && (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            )}
            {mapaContext.modoVisao === MODO_VISAO.mapaProprio && (
              <ImageOverlay bounds={bounds} url="/new-map.jpg" />
            )}
            {mapaContext.modoVisao === MODO_VISAO.openstreetmap && (
              <Marker position={center}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            )}
            <LocationMarker />
          </MapContainer>
        </div>
      </Grid>
    )
  );
}
