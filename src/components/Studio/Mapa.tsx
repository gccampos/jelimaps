import {
  MapContainer,
  TileLayer,
  Marker,
  ImageOverlay,
  Rectangle,
  Popup,
} from "react-leaflet";
import L, { LatLngBounds, LatLng, divIcon, Map } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import CustomControlLeaflet, {
  POSITION_CLASSES_CUSTOM_CONTROL,
} from "@/components/CustomControlLeaflet/CustomControlLeaflet";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import {
  Button,
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  TextField,
} from "@mui/material";
// import Elementos from "./Elementos";
import { PlaylistPlay, LocationOn } from "@mui/icons-material";
import ReactDOMServer from "react-dom/server";
import useCaixaDialogo from "../CaixaDialogo/useCaixaDialogo";
import ImageResolver from "@/components/ImageUrlResolver";
import ImageOverlayRotated from "../Mapa/ImageOverlayRotated";
import { elementoPadrao, tipoElemento } from "../Mapa/context/mapaContextTypes";
import { TerraDraw, GeoJSONStoreFeatures } from "terra-draw";
import MapaFunctionHelpers from "../Mapa/context/MapaFunctionsHelpers";
import UndoControl from "./UndoControl";

export const MODO_VISAO = {
  openstreetmap: "OpenStreetMap",
  mapaProprio: "Mapa Próprio",
};

export default function Mapa(props: {
  altura: number;
  draw: TerraDraw;
  setMapa: React.Dispatch<React.SetStateAction<L.Map>>;
  conteudoElementosRef: React.MutableRefObject<tipoElemento[]>;
}) {
  const { setMapa, conteudoElementosRef } = props;
  const [isMounted, setIsMounted] = React.useState(false);
  const [map, setMap] = useState<Map>(null);
  const caixaDialogoRef = useRef<String>(null);
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
    if (map && !isMounted) {
      map.on("moveend", () => {
        dispatch({ type: "alteraPropriedadesMapa", map: map });
      });
      setMapa(map);
      setIsMounted(true);
    }
  }, [map, isMounted, dispatch, setMapa]);

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

  const urlImageRef = useRef<string>();
  const { openModalConfirm, closeModalConfirm, onConfirm } = useCaixaDialogo();

  const handleDispatchInserirImageOverlay = React.useCallback(() => {
    dispatch({
      type: "adicionarImageOverlay",
      tipo: "ImageOverlay",
      valor: ImageResolver.UrlResolver(urlImageRef.current),
    });
    props.draw.setMode("select");
    closeModalConfirm(null, null);
    caixaDialogoRef.current = urlImageRef.current = null;
  }, [dispatch, closeModalConfirm, props.draw]);

  const handleInserirImagem = React.useCallback(() => {
    openModalConfirm({
      title: "",
      onClosed: () => {
        caixaDialogoRef.current = null;
      },
      message: "",
      onConfirm,
      cancelarNotVisible: true,
      confirmarNotVisible: true,
      componentMessage: (
        <div>
          <DialogTitle>
            Por favor, insira a url da imagem do seu mapa!
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              id="outlined-controlled"
              label="Controlled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                urlImageRef.current = event.target.value;
              }}
            />
            {urlImageRef.current &&
            urlImageRef.current !== "" &&
            ImageResolver.isValidUrl(urlImageRef.current) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="MapaProprio"
                src={ImageResolver.UrlResolver(urlImageRef.current)}
                width={1250}
                height={1250}
              />
            ) : (
              <div> Copie um link válido</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInserirImagem}>Atualizar</Button>
            {urlImageRef.current &&
              urlImageRef.current !== "" &&
              ImageResolver.isValidUrl(urlImageRef.current) && (
                <Button onClick={handleDispatchInserirImageOverlay}>
                  Salvar
                </Button>
              )}
          </DialogActions>
        </div>
      ),
    });
  }, [openModalConfirm, onConfirm, handleDispatchInserirImageOverlay]);

  useEffect(() => {
    if (
      mapaContext.center &&
      map &&
      mapaContext.center?.lat !== map.getCenter().lat &&
      mapaContext.center?.lng !== map.getCenter().lng
    )
      map.setView(mapaContext.center, mapaContext.zoom);
    if (
      mapaContext.caixaDialogo &&
      mapaContext.caixaDialogo !== caixaDialogoRef.current &&
      mapaContext.caixaDialogo !== ""
    ) {
      caixaDialogoRef.current = mapaContext.caixaDialogo;
      dispatch({
        type: "limpaCaixaDialogo",
      });
      handleInserirImagem();
    }

    // setConteudoElementos(
    //   MapaFunctionHelpers.retornaListaElementosConteudo(mapaContext)
    // );
    console.log("mapaContext", mapaContext);
    conteudoElementosRef.current =
      MapaFunctionHelpers.retornaListaElementosConteudoCenaAtual(mapaContext);
  });

  // const verificaElementoFocadoPorId = (id) => {
  //   return (
  //     mapaContext?.elementosFoco
  //       ?.concat([mapaContext?.elementoFoco])
  //       .filter((x) => x) ?? [mapaContext?.elementoFoco]
  //   ).some((x) => x?.id === id);
  // };

  const corItemSelecionadoFoco = (el) => {
    return (mapaContext.elementosFoco &&
      mapaContext.elementosFoco.length > 0 &&
      mapaContext.elementosFoco?.some((x) => x.id === el.id)) ||
      mapaContext.elementoFoco?.id === el.id
      ? "#000000"
      : el.color ?? "#0d6efd";
  };

  const ConteudoMapa = (p: { el: elementoPadrao }) => {
    const el = new L.GeoJSON(p.el);
    useEffect(() => {
      if (map && props.draw) {
        if (p.el.draggable) {
          const ds = p.el as GeoJSONStoreFeatures;
          try {
            props.draw?.addFeatures([ds]);
            if (
              mapaContext.elementoFoco?.id === p.el.id &&
              !(props.draw as any)._mode.selected?.some((x) => x === p.el.id)
            )
              (props.draw as any)._mode.selected = [p.el.id];
            //(props.draw as any)._mode.onSelect(p.el.id);
          } catch (error) {
            console.error(error);
            dispatch({
              type: "removeElements",
              id: p.el.id,
            });
          }
        } else {
          el.on("click", () =>
            dispatch({
              type: "selecionarElementoFoco",
              id: p.el.id,
            })
          );
          map.addLayer(el);
        }
        return () => {
          // props.draw.removeFeatures([p.el.id.toString()]);
          if (
            p.el.draggable ||
            Object.keys((props.draw as any)._store.store).some(
              (x) => x === p.el.id
            )
          ) {
            // if (mapaContext.elementoFoco?.id === p.el.id)
            //   (props.draw as any)._mode.deselect();
            if (
              MapaFunctionHelpers.retornaListaElementosConteudo(
                mapaContext
              ).some((x) => x.id === p.el.id)
            ) {
              // props.draw.removeFeatures([p.el.id.toString()]);
              if (
                (props.draw as any)._store &&
                (props.draw as any)._store.store[p.el.id.toString()]
              )
                props.draw.removeFeatures([p.el.id.toString()]);
            }
          } else {
            map.removeLayer(el);
          }
        };
      }
    });
    return null;
  };

  return (
    <Grid item xs>
      <div style={{ height: props.altura, display: "grid" }}>
        <MapContainer
          center={mapaContext.mapOptions?.center ?? center}
          zoom={mapaContext.mapOptions?.zoom ?? zoom}
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
            <ImageOverlay
              bounds={bounds}
              url={
                mapaContext.urlMapaProprio ??
                "https://onedrive.live.com/embed?resid=9337381634E30E6%211127330&authkey=%21ADDU_4ofkVlIREA&width=4096&height=2896"
              }
            />
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
                x.geometry?.coordinates && (
                  <Marker
                    {...x}
                    position={x.geometry.coordinates as [number, number]}
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
                          nomePropriedade: "geometry",
                          valorPropriedade: {
                            ...x.geometry,
                            coordinates: [
                              e.sourceTarget._latlng.lat,
                              e.sourceTarget._latlng.lng,
                            ],
                          },
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
                            openModalConfirm({
                              title: "Deletar item",
                              message: "Você tem certeza disso?",
                              onConfirm: () => {
                                dispatch({
                                  type: "removeElements",
                                });
                              },
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
                )
              );
            })}
          {mapaContext.conteudo &&
            mapaContext.conteudo.Point &&
            mapaContext.conteudo.Point.length > 0 &&
            mapaContext.conteudo.Point.filter(
              (x) =>
                new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(x.cenaFim) >= new Date(mapaContext.tempo)
            ).map((x, i) => {
              return <ConteudoMapa el={x} key={`Pointer#${i}`} />;
            })}
          {mapaContext.conteudo &&
            mapaContext.conteudo.Circle &&
            mapaContext.conteudo.Circle.length > 0 &&
            mapaContext.conteudo.Circle.filter(
              (x) =>
                new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(x.cenaFim) >= new Date(mapaContext.tempo)
            ).map((x, i) => {
              return <ConteudoMapa el={x} key={`Circle#${i}`} />;
            })}
          {mapaContext.conteudo &&
            mapaContext.conteudo.LineString &&
            mapaContext.conteudo.LineString.length > 0 &&
            mapaContext.conteudo.LineString.filter(
              (x) =>
                new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(x.cenaFim) >= new Date(mapaContext.tempo)
            ).map((x, i) => {
              return <ConteudoMapa el={x} key={`LineString#${i}`} />;
            })}

          {mapaContext.conteudo &&
            mapaContext.conteudo.Polygon &&
            mapaContext.conteudo.Polygon.length > 0 &&
            mapaContext.conteudo.Polygon.filter(
              (x) =>
                new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(x.cenaFim) >= new Date(mapaContext.tempo)
            ).map((x, i) => {
              return <ConteudoMapa el={x} key={`polygon#${i}`} />;
              // return x?.geometry.coordinates.positions ? (
              //   <div key={`polygon#${i}`}>
              //     <Polygon
              //       {...x}
              //       pathOptions={{
              //         color: corItemSelecionadoFoco(x),
              //       }}
              //       eventHandlers={{
              //         click: (e) => cliqueElementoNoMapa(arr[i], e),
              //       }}
              //     ></Polygon>
              //   </div>
              // ) : null;
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
          {mapaContext.conteudo &&
            mapaContext.conteudo.ImageOverlay &&
            mapaContext.conteudo.ImageOverlay.length > 0 &&
            mapaContext.conteudo.ImageOverlay.filter(
              (x) =>
                new Date(x.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(x.cenaFim) >= new Date(mapaContext.tempo)
            ).map((x, i) => {
              return (
                <ImageOverlayRotated
                  key={`ImageOverlay#${i}`}
                  x={x}
                  cliqueElementoNoMapa={cliqueElementoNoMapa}
                />
              );
            })}
          {/* <CustomControlLeaflet
            position={POSITION_CLASSES_CUSTOM_CONTROL.bottomright}
          >
            <Elementos altura={props.altura} />
          </CustomControlLeaflet> */}
          <CustomControlLeaflet
            position={POSITION_CLASSES_CUSTOM_CONTROL.topleft}
          >
            <UndoControl />
          </CustomControlLeaflet>
          <CustomControlLeaflet
            position={POSITION_CLASSES_CUSTOM_CONTROL.topright}
          >
            <Fab
              color="primary"
              onClick={() => dispatch({ type: "propriedadeToggle" })}
              sx={{ zIndex: 100000 }}
            >
              <PlaylistPlay
                sx={{
                  transform: !mapaContext.slidePropriedade ? "scaleX(-1)" : "",
                }}
              />
            </Fab>
          </CustomControlLeaflet>
          {/* <AddElementoInteracao /> */}
        </MapContainer>
      </div>
    </Grid>
  );
}
