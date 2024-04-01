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
              minZoom={mapaContext.modoVisao === MODO_VISAO.mapaProprio ? 9 : 5}
            >
              {mapaContext.modoVisao === MODO_VISAO.openstreetmap && (
                <TileLayer
                  attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
                  maxNativeZoom={19}
                  maxZoom={23}
                />
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
