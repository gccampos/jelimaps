import {
  MapContainer,
  TileLayer,
  Marker,
  ImageOverlay,
  Polyline,
  Polygon,
  Circle,
  Rectangle,
  Popup,
} from "react-leaflet";
import { LatLngBounds, LatLng, divIcon, Map } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import CustomControlLeaflet, {
  POSITION_CLASSES_CUSTOM_CONTROL,
} from "@/components/CustomControlLeaflet/CustomControlLeaflet";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Button, ButtonGroup, Fab, Grid } from "@mui/material";
import Elementos from "./Elementos";
import AddElementoInteracao from "@/components/Mapa/AddElementoInteracao";
import { PlaylistPlay, LocationOn } from "@mui/icons-material";
import ReactDOMServer from "react-dom/server";

export const MODO_VISAO = {
  openstreetmap: "OpenStreetMap",
  mapaProprio: "Mapa Próprio",
};

export default function Mapa(props: { altura: number }) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [map, setMap] = useState<Map>(null);
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const position = useMemo(
    () =>
      mapaContext.modoVisao === MODO_VISAO.openstreetmap
        ? [-22.906659526195618, -43.1333403313017]
        : [0.5, 0.75],
    [mapaContext.modoVisao]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const center = useMemo(
    () => new LatLng(position[0], position[1]),
    [position]
  );
  const zoom = mapaContext.modoVisao === MODO_VISAO.openstreetmap ? 15 : 9;
  useEffect(() => {
    if (map != null) map.setView(center, zoom);
  }, [mapaContext.modoVisao, map, center, zoom]);

  const bounds = new LatLngBounds([0, 0], [1, 1.5]);

  const cliqueElementoNoMapa = (elemento, evento) => {
    if (evento.originalEvent.shiftKey || evento.originalEvent.ctrlKey)
      dispatch({ type: "adicionarElementoFoco", elemento: elemento });
    else dispatch({ type: "selecionarElementoFoco", elemento: elemento });
  };

  useEffect(() => {
    if (
      mapaContext.center &&
      map &&
      mapaContext.center?.lat !== map.getCenter().lat &&
      mapaContext.center?.lng !== map.getCenter().lng
    )
      map.setView(mapaContext.center, mapaContext.zoom);
    console.log("contexto do mapa", mapaContext);
  });
  useEffect(() => {
    if (map) {
      console.log("map", map);
      console.log("map.options", map?.options);
      map.on("moveend", () => {
        dispatch({ type: "alteraPropriedadesMapa", map: map });
      });
    }
  }, [map, dispatch]);

  const verificaElementoFocadoPorId = (id) => {
    return (
      mapaContext?.elementosFoco
        ?.concat([mapaContext?.elementoFoco])
        .filter((x) => x) ?? [mapaContext?.elementoFoco]
    ).some((x) => x?.id === id);
  };

  const corItemSelecionadoFoco = (el) => {
    return mapaContext.elementosFoco && mapaContext.elementosFoco.length > 0
      ? mapaContext.elementosFoco?.some((x) => x.id === el.id)
        ? "#000000"
        : el.color ?? "#0d6efd"
      : mapaContext.elementoFoco?.id === el.id
      ? "#000000"
      : el.color ?? "#0d6efd";
  };
  return (
    isMounted && (
      <Grid item xs>
        <div style={{ height: props.altura, display: "grid" }}>
          <MapContainer
            center={mapaContext.mapOptions.center ?? center}
            zoom={mapaContext.mapOptions.zoom ?? zoom}
            ref={setMap}
            maxZoom={18}
          >
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
              mapaContext.conteudo.Marker.filter(
                (x) =>
                  new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                  new Date(x.cenaFim) >= new Date(mapaContext.tempo)
              ).map((x, i, arr) => {
                return (
                  <Marker
                    {...x}
                    icon={divIcon({
                      className: "",
                      html: ReactDOMServer.renderToString(
                        <LocationOn
                          style={{
                            color: corItemSelecionadoFoco(x),
                            position: "absolute",
                            top: "-150%",
                            left: "-67%",
                          }}
                        />
                      ),
                    })}
                    key={`marker#${i}`}
                    eventHandlers={{
                      click: (e) => cliqueElementoNoMapa(arr[i], e),
                      moveend: (e) => {
                        dispatch({
                          type: "editarPropriedade",
                          tipo: x.dataRef,
                          id: x.id,
                          nomePropriedade: "position",
                          valorPropriedade: e.sourceTarget._latlng,
                        });
                      },
                    }}
                  >
                    <Popup>
                      <ButtonGroup
                        variant="text"
                        aria-label="text button group"
                      >
                        <Button
                          onClick={() => {
                            dispatch({
                              type: "removeElements",
                            });
                          }}
                        >
                          Excluir
                        </Button>
                        {/* <Button>Two</Button>
                              <Button>Three</Button> */}
                      </ButtonGroup>
                    </Popup>
                  </Marker>
                );
              })}
            {mapaContext.conteudo &&
              mapaContext.conteudo.Polyline &&
              mapaContext.conteudo.Polyline.length > 0 &&
              mapaContext.conteudo.Polyline.filter(
                (x) =>
                  new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                  new Date(x.cenaFim) >= new Date(mapaContext.tempo)
              ).map((x, i, arr) => {
                return (
                  <div key={`polyline#${i}`}>
                    <Polyline
                      {...x}
                      pathOptions={{
                        color: corItemSelecionadoFoco(x),
                      }}
                      eventHandlers={{
                        click: (e) => cliqueElementoNoMapa(arr[i], e),
                      }}
                    ></Polyline>
                    {x.draggable &&
                      verificaElementoFocadoPorId(x.id) &&
                      x.positions.map((latlng, indexPosition, arrPositions) => (
                        <Marker
                          {...x}
                          position={latlng}
                          eventHandlers={{
                            moveend: (e) => {
                              arrPositions[indexPosition] =
                                e.sourceTarget._latlng;
                              dispatch({
                                type: "editarPropriedade",
                                tipo: x.dataRef,
                                id: x.id,
                                nomePropriedade: "positions",
                                valorPropriedade: [...arrPositions],
                              });
                            },
                          }}
                          key={`polyline_marker#${indexPosition}`}
                        >
                          <Popup>
                            <ButtonGroup
                              variant="text"
                              aria-label="text button group"
                            >
                              <Button
                                onClick={() => {
                                  arrPositions.splice(indexPosition, 1);
                                  dispatch({
                                    type: "editarPropriedade",
                                    tipo: x.dataRef,
                                    id: x.id,
                                    nomePropriedade: "positions",
                                    valorPropriedade: [...arrPositions],
                                  });
                                }}
                              >
                                Excluir
                              </Button>
                              {/* <Button>Two</Button>
                              <Button>Three</Button> */}
                            </ButtonGroup>
                          </Popup>
                        </Marker>
                      ))}
                  </div>
                );
              })}
            {mapaContext.conteudo &&
              mapaContext.conteudo.Polygon &&
              mapaContext.conteudo.Polygon.length > 0 &&
              mapaContext.conteudo.Polygon.filter(
                (x) =>
                  new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                  new Date(x.cenaFim) >= new Date(mapaContext.tempo)
              ).map((x, i, arr) => {
                return x?.positions ? (
                  <div key={`polygon#${i}`}>
                    <Polygon
                      {...x}
                      pathOptions={{
                        color: corItemSelecionadoFoco(x),
                      }}
                      eventHandlers={{
                        click: (e) => cliqueElementoNoMapa(arr[i], e),
                      }}
                    ></Polygon>
                    {x.draggable &&
                      verificaElementoFocadoPorId(x.id) &&
                      x.positions.map((latlng, indexPosition, arrPositions) => (
                        <Marker
                          {...x}
                          position={latlng}
                          eventHandlers={{
                            moveend: (e) => {
                              arrPositions[indexPosition] =
                                e.sourceTarget._latlng;
                              dispatch({
                                type: "editarPropriedade",
                                tipo: x.dataRef,
                                id: x.id,
                                nomePropriedade: "positions",
                                valorPropriedade: [...arrPositions],
                              });
                            },
                          }}
                          key={`polygon_marker#${indexPosition}`}
                        >
                          <Popup>
                            <ButtonGroup
                              variant="text"
                              aria-label="text button group"
                            >
                              <Button
                                onClick={() => {
                                  arrPositions.splice(indexPosition, 1);
                                  dispatch({
                                    type: "editarPropriedade",
                                    tipo: x.dataRef,
                                    id: x.id,
                                    nomePropriedade: "positions",
                                    valorPropriedade: [...arrPositions],
                                  });
                                }}
                              >
                                Excluir
                              </Button>
                              {/* <Button>Two</Button>
                            <Button>Three</Button> */}
                            </ButtonGroup>
                          </Popup>
                        </Marker>
                      ))}
                  </div>
                ) : null;
              })}
            {mapaContext.conteudo &&
              mapaContext.conteudo.Circle &&
              mapaContext.conteudo.Circle.length > 0 &&
              mapaContext.conteudo.Circle.filter(
                (x) =>
                  new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                  new Date(x.cenaFim) >= new Date(mapaContext.tempo)
              ).map((x, i) => {
                return x?.center ? (
                  <div key={`circle#${i}`}>
                    <Circle
                      {...x}
                      pathOptions={{
                        color: corItemSelecionadoFoco(x),
                      }}
                      eventHandlers={{
                        click: (e) => cliqueElementoNoMapa(x, e),
                      }}
                    >
                      {/* <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup> */}
                    </Circle>
                    {x.draggable && verificaElementoFocadoPorId(x.id) && (
                      <Marker
                        {...x}
                        position={x.center}
                        eventHandlers={{
                          moveend: (e) => {
                            dispatch({
                              type: "editarPropriedade",
                              tipo: x.dataRef,
                              id: x.id,
                              nomePropriedade: "center",
                              valorPropriedade: e.sourceTarget._latlng,
                            });
                          },
                        }}
                        key={`circle_marker#${i}`}
                      >
                        <Popup>
                          <ButtonGroup
                            variant="text"
                            aria-label="text button group"
                          >
                            <Button
                              onClick={() => {
                                dispatch({
                                  type: "removeElements",
                                });
                              }}
                            >
                              Excluir
                            </Button>
                            {/* <Button>Two</Button>
                                <Button>Three</Button> */}
                          </ButtonGroup>
                        </Popup>
                      </Marker>
                    )}
                  </div>
                ) : null;
              })}
            {mapaContext.conteudo &&
              mapaContext.conteudo.Rectangle &&
              mapaContext.conteudo.Rectangle.length > 0 &&
              mapaContext.conteudo.Rectangle.filter(
                (x) =>
                  new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                  new Date(x.cenaFim) >= new Date(mapaContext.tempo)
              ).map((x, i) => {
                return x?.bounds ? (
                  <Rectangle
                    {...x}
                    key={`Rectangle#${i}`}
                    eventHandlers={{
                      click: (e) => cliqueElementoNoMapa(x, e),
                    }}
                  >
                    {/* <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup> */}
                  </Rectangle>
                ) : null;
              })}
            {mapaContext.conteudo &&
              mapaContext.conteudo.cenas &&
              mapaContext.conteudo.cenas.length > 0 &&
              mapaContext.conteudo.cenas
                .filter(
                  (x) =>
                    !!x.exibirLimite &&
                    new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                    new Date(x.cenaFim) >= new Date(mapaContext.tempo)
                )
                .map((x, i) => {
                  return x?.bounds ? (
                    <Rectangle
                      {...x}
                      bounds={x.bounds}
                      className="background-scene"
                      key={`Rectangle#${i}`}
                    >
                      {/* <Popup>
                          A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup> */}
                    </Rectangle>
                  ) : null;
                })}
            <CustomControlLeaflet
              position={POSITION_CLASSES_CUSTOM_CONTROL.bottomright}
            >
              <Elementos altura={props.altura} />
            </CustomControlLeaflet>
            <CustomControlLeaflet
              position={POSITION_CLASSES_CUSTOM_CONTROL.topright}
            >
              <Fab
                color="primary"
                onClick={() => dispatch({ type: "propriedadeToggle" })}
              >
                <PlaylistPlay
                  sx={{
                    transform: !mapaContext.slidePropriedade
                      ? "scaleX(-1)"
                      : "",
                  }}
                />
              </Fab>
            </CustomControlLeaflet>
            <AddElementoInteracao />
          </MapContainer>
        </div>
      </Grid>
    )
  );
}
