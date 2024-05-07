"use client";
import { MapContainer, ImageOverlay } from "react-leaflet";
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
import { Map } from "leaflet";
import PlanoFundoMapaComum from "@/components/Mapa/PlanoFundoMapaComum/PlanoFundoMapaComum";
import ConteudoMapa from "../ConteudoMapa";
import SliderLinhaTempo from "../SliderLinhaTempo";

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

  const [bounds, setBounds] = useState<LatLngBounds>(
    new LatLngBounds([0, 0], [1, 1.5])
  );
  useEffect(() => {
    if (mapaContext.modoVisao === MODO_VISAO.mapaProprio)
      getImageDimensions(mapaContext.urlMapaProprio).then((dimensions) =>
        setBounds(
          new LatLngBounds(
            [0, 0],
            [(dimensions as any).height, (dimensions as any).width]
          )
        )
      );
  }, [mapaContext.modoVisao, mapaContext.urlMapaProprio]);

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
  const _isMobile = React.useMemo(
    () => isMobile(height, width),
    [height, width]
  );
  return (
    <>
      <Grid item container xs={12}>
        {!_isMobile && (
          <Legenda
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
              height: _isMobile ? height - alturaLegenda : height,
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
                <PlanoFundoMapaComum />
              )}
              {mapaContext.modoVisao === MODO_VISAO.mapaProprio && (
                <ImageOverlay
                  bounds={bounds}
                  url={mapaContext.urlMapaProprio}
                />
              )}
              <ConteudoMapa isApresentacao={true} />
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
              {/* <LinhaTempo
                timelineSliderControl={timelineSliderControl}
                setTimelineSliderControl={setTimelineSliderControl}
              /> */}
              <CustomControlLeaflet
                position={POSITION_CLASSES_CUSTOM_CONTROL.bottomleft}
                classCustom={
                  "leaflet-control leaflet-bar leaflet-speeddial leaflet-speeddial-full-width"
                }
              >
                <SliderLinhaTempo isMobile={_isMobile} />
              </CustomControlLeaflet>
            </MapContainer>
          </div>
        </Grid>
        {_isMobile && (
          <Legenda
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
