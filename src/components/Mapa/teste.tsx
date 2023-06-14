import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  ImageOverlay,
  useMap,
  Polyline,
  Polygon,
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
import { elementos } from "@/main/constants/elementos";

export const MODO_VISAO = {
  openstreetmap: "OpenStreetMap",
  mapaProprio: "Mapa Próprio",
};

function isControlLeafLet(node) {
  console.log(node);
  return node.tagName !== "path"
    ? node.className.includes("leaflet-control")
      ? node.className.includes("leaflet-control")
      : node.className.includes("leaflet-container")
      ? !node.className.includes("leaflet-container")
      : node.parentElement
      ? isControlLeafLet(node.parentElement)
      : false
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
      mapaContext?.elemento &&
        mapaContext?.elemento.nome &&
        mapaContext?.elemento.nome !== elementos.Hand.nome
        ? {
            click(e) {
              console.log(e.latlng);
              if (!isControlLeafLet(e.originalEvent.target))
                dispatch({
                  type: "addMarker",
                  elemento: mapaContext.elemento.nome,
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

  // useEffect(() => {
  //   console.log("lista de markers", mapaContext.conteudo?.marker);
  //   console.log(mapaContext.conteudo?.marker?.length);
  //   if (
  //     mapaContext.conteudo &&
  //     mapaContext.conteudo.marker &&
  //     mapaContext.conteudo.marker.length > 0
  //   )
  //     mapaContext.conteudo.marker.map((x, i) => {
  //       console.log("AAAA", x);
  //     });
  // }, [mapaContext.conteudo?.marker]);

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
            {mapaContext.conteudo &&
              mapaContext.conteudo.Marker &&
              mapaContext.conteudo.Marker.length > 0 &&
              mapaContext.conteudo.Marker.map((x, i) => {
                return x?.position ? (
                  <Marker
                    {...x}
                    key={`marker#${i}`}
                    eventHandlers={{
                      click: () =>
                        mapaContext.elemento?.nome !== elementos.Marker.nome &&
                        x.dataRef === mapaContext.elemento?.nome
                          ? dispatch({
                              type: `add${x.dataRef}`,
                              elemento: mapaContext.elemento.nome,
                            })
                          : null,
                    }}
                  >
                    {/* <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup> */}
                  </Marker>
                ) : null;
              })}
            {mapaContext.conteudo &&
              mapaContext.conteudo.Polyline &&
              mapaContext.conteudo.Polyline.length > 0 &&
              mapaContext.conteudo.Polyline.map((x, i) => {
                return x?.positions ? (
                  <Polyline
                    {...x}
                    key={`polyline#${i}`}
                    // eventHandlers={{
                    //   click: () =>
                    //     mapaContext.elemento?.nome !== elementos.Marker.nome &&
                    //     x.dataRef === mapaContext.elemento?.nome
                    //       ? dispatch({
                    //           type: `add${x.dataRef}`,
                    //           elemento: mapaContext.elemento.nome,
                    //         })
                    //       : null,
                    // }}
                  ></Polyline>
                ) : null;
              })}
            {mapaContext.conteudo &&
              mapaContext.conteudo.Polygon &&
              mapaContext.conteudo.Polygon.length > 0 &&
              mapaContext.conteudo.Polygon.map((x, i) => {
                return x?.positions ? (
                  <Polygon
                    {...x}
                    key={`polygon#${i}`}
                    // eventHandlers={{
                    //   click: () =>
                    //     mapaContext.elemento?.nome !== elementos.Marker.nome &&
                    //     x.dataRef === mapaContext.elemento?.nome
                    //       ? dispatch({
                    //           type: `add${x.dataRef}`,
                    //           elemento: mapaContext.elemento.nome,
                    //         })
                    //       : null,
                    // }}
                  ></Polygon>
                ) : null;
              })}
            <LocationMarker />
          </MapContainer>
        </div>
      </Grid>
    )
  );
}
