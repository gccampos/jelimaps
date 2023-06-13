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
import { Button, Dropdown } from "react-bootstrap";
import dynamic from "next/dynamic";
import Dialog from "@mui/material/Dialog";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

const MODO_VISAO = {
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
  const [modoVisao, setModoVisao] = useState(MODO_VISAO.openstreetmap);
  const position = useMemo(
    () =>
      modoVisao === MODO_VISAO.openstreetmap
        ? [-22.884735317908625, -43.25314700603486]
        : [0.5, 0.75],
    [modoVisao]
  );

  interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
  }

  function DialogTitle(props: DialogTitleProps) {
    const { children, ...other } = props;

    return <DialogTitle {...other}>{children};</DialogTitle>;
  }

  function ModoVisaoDialog() {
    const [open, setOpen] = React.useState(true);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleOpenStreetMap = () => {
      setModoVisao(MODO_VISAO.openstreetmap);
      setOpen(false);
    };
    const handleMapaProprio = () => {
      setModoVisao(MODO_VISAO.mapaProprio);
      setOpen(false);
    };

    return (
      <div>
        <Dialog aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title">
            Por favor, selecione o modo de visualização
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              OpenStreetMaps: Nesse modo, você utilizará os mapas da base do
              OpenStreetMaps.
            </Typography>
            <Typography gutterBottom>
              Mapa Próprio: Nesse modo, você terá que subir uma imagem para
              utilizar como mapa.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOpenStreetMap}>OpenStreetMap</Button>
            <Button onClick={handleMapaProprio}>Mapa Próprio</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

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
      <>
        <MapContainer center={center} zoom={zoom} ref={setMap} maxZoom={18}>
          {modoVisao === MODO_VISAO.openstreetmap && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          {modoVisao === MODO_VISAO.mapaProprio && (
            <ImageOverlay bounds={bounds} url="/new-map.jpg" />
          )}
          {modoVisao === MODO_VISAO.openstreetmap && (
            <Marker position={center}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )}
          <LocationMarker />
        </MapContainer>
        <ModoVisaoDialog/>
      </>  
    )
  );
}
