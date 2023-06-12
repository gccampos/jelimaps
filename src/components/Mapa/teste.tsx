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
import { Dropdown } from "react-bootstrap";
import dynamic from "next/dynamic";

const MODO_VISAO = {
  openstreetmap: "OpenStreetMap",
  rpg: "RPG",
  //paintball: 'Paintball',
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
  const [modoVisao, setModoVisao] = useState(MODO_VISAO.openstreetmap);
  const position = useMemo(
    () =>
      modoVisao === MODO_VISAO.openstreetmap
        ? [-22.884735317908625, -43.25314700603486]
        : [0.5, 0.75],
    [modoVisao]
  );

  function LocationMarker() {
    const [position, setPosition] = useState(null);
    useMapEvents({
      click(e) {
        if (!isControlLeafLet(e.originalEvent.target)) setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const center = useMemo(
    () => new LatLng(position[0], position[1]),
    [position]
  );
  const zoom = modoVisao === MODO_VISAO.openstreetmap ? 13 : 9;
  useEffect(() => {
    console.log(center);
    if (map != null) map.setView(center, zoom);
  }, [modoVisao, map, center, zoom]);

  const bounds = new LatLngBounds([0, 0], [1, 1.5]);

  return (
    isMounted && (
      <MapContainer center={center} zoom={zoom} ref={setMap} maxZoom={18}>
        {modoVisao === MODO_VISAO.openstreetmap && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        {modoVisao === MODO_VISAO.rpg && (
          <ImageOverlay bounds={bounds} url="/new-map.jpg" />
        )}
        <CustomControlLeaftlet position={"topright"}>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Alterne entre modos de visão
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                href="#"
                onClick={() => setModoVisao(MODO_VISAO.openstreetmap)}
              >
                {MODO_VISAO.openstreetmap}
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={() => setModoVisao(MODO_VISAO.rpg)}
              >
                {MODO_VISAO.rpg}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </CustomControlLeaftlet>
        {modoVisao === MODO_VISAO.openstreetmap && (
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        )}
        <LocationMarker />
      </MapContainer>
    )
  );
}
