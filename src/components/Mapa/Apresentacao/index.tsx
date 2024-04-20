"use client";
import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import { LatLng, LatLngBounds } from "leaflet";
import { useEffect, useState } from "react";
import React from "react";
import CustomControlLeaflet, {
  POSITION_CLASSES_CUSTOM_CONTROL,
} from "@/components/CustomControlLeaflet/CustomControlLeaflet";
import { useMapaContext, useMapaDispatch } from "@/components/Mapa/MapaContext";
import { Fab, Grid } from "@mui/material";
// import Elementos from "./Elementos";
import { Close } from "@mui/icons-material";
import { MODO_VISAO } from "../mapaContextTypes";
import { getImageDimensions } from "../MapaUtils";
import useWindowDimensions from "../../Studio/useWindowDimensions";
import Legenda from "./legenda";
import LinhaTempo from "./linhaTempo";
import Leaflet, { Map } from "leaflet";
import Image from "next/image";

export const isMobile = (height: number, width: number) => {
  return (
    "ontouchstart" in document.documentElement &&
    !!navigator.userAgent.match(/Mobi/) &&
    height > width
  );
};

const Apresentacao = () => {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const { height, width } = useWindowDimensions();
  const [map, setMap] = useState<Map>(null);
  const [larguraLegenda, setLarguraLegenda] = useState(250);
  const [alturaLegenda, setAlturaLegenda] = useState(height * 0.5);
  const [timelineSliderControl, setTimelineSliderControl] =
    useState<Leaflet.TimelineSliderControl>();

  const [bounds, setBounds] = useState<LatLngBounds>(
    new LatLngBounds([0, 0], [1, 1.5])
  );
  useEffect(() => {
    getImageDimensions(mapaContext.urlMapaProprio).then((dimensions) =>
      setBounds(
        new LatLngBounds(
          [0, 0],
          [(dimensions as any).height, (dimensions as any).width]
        )
      )
    );
  }, [mapaContext.urlMapaProprio]);

  const position = React.useMemo(
    () =>
      mapaContext.modoVisao === MODO_VISAO.openstreetmap
        ? [-22.906659526195618, -43.1333403313017]
        : [0.5, 0.75],
    [mapaContext.modoVisao]
  );
  const center = React.useMemo(
    () => new LatLng(position[0], position[1]),
    [position]
  );
  const zoom = mapaContext.modoVisao === MODO_VISAO.openstreetmap ? 15 : 9;
  return (
    <>
      <Grid item container xs={12}>
        {!isMobile(height, width) && (
          <Legenda
            timelineSliderControl={timelineSliderControl}
            map={map}
            larguraLegenda={larguraLegenda}
            setLarguraLegenda={setLarguraLegenda}
            alturaLegenda={alturaLegenda}
            setAlturaLegenda={setAlturaLegenda}
          />
        )}
        <Grid item xs>
          <div
            style={{
              height: isMobile(height, width) ? height - alturaLegenda : height,
              display: "grid",
            }}
          >
            <MapContainer
              center={mapaContext.center ?? center}
              zoom={mapaContext.zoom ?? zoom}
              maxZoom={23}
              ref={setMap}
              minZoom={mapaContext.modoVisao === MODO_VISAO.mapaProprio ? 9 : 3}
            >
              {mapaContext.modoVisao === MODO_VISAO.openstreetmap && (
                <TileLayer
                  attribution="Map data ©2023"
                  url="http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}"
                  maxNativeZoom={20}
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                  maxZoom={23}
                />
              )}

              {mapaContext.modoVisao === MODO_VISAO.openstreetmap && (
                <CustomControlLeaflet
                  position={POSITION_CLASSES_CUSTOM_CONTROL.bottomleft}
                >
                  <Image
                    src={"/assets/google_on_white.png"}
                    alt="logo google"
                    width={width * 0.07 > 60 ? 60 : width * 0.07}
                    height={height * 0.05 > 20 ? 20 : height * 0.05}
                  />
                </CustomControlLeaflet>
              )}
              {mapaContext.modoVisao === MODO_VISAO.mapaProprio && (
                <ImageOverlay
                  bounds={bounds}
                  url={mapaContext.urlMapaProprio}
                />
              )}
              <CustomControlLeaflet
                position={POSITION_CLASSES_CUSTOM_CONTROL.topright}
              >
                <Fab
                  color="primary"
                  onClick={() =>
                    dispatch({
                      type: "alteraPropriedadeGeral",
                      nomePropriedade: "playStatus",
                      valorPropriedade: -1,
                    })
                  }
                  sx={{ zIndex: 100000 }}
                >
                  <Close />
                </Fab>
              </CustomControlLeaflet>
              <LinhaTempo
                timelineSliderControl={timelineSliderControl}
                setTimelineSliderControl={setTimelineSliderControl}
              />
            </MapContainer>
          </div>
        </Grid>
        {isMobile(height, width) && (
          <Legenda
            timelineSliderControl={timelineSliderControl}
            map={map}
            larguraLegenda={larguraLegenda}
            setLarguraLegenda={setLarguraLegenda}
            alturaLegenda={alturaLegenda}
            setAlturaLegenda={setAlturaLegenda}
          />
        )}
      </Grid>
    </>
  );
};

export default Apresentacao;
