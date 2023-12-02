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
import { useMapaContext, useMapaDispatch } from "@/components/Mapa/MapaContext";
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
import {
  MODO_VISAO,
  elementoPadrao,
  tipoElemento,
} from "../Mapa/mapaContextTypes";
import { TerraDraw, GeoJSONStoreFeatures } from "terra-draw";
import MapaContextChanger from "../Mapa/ContextChangers";
import UndoControl from "./UndoControl";
import { getImageDimensions } from "../Mapa/MapaUtils";

export default function Mapa(propsMapa: {
  altura: number;
  draw: TerraDraw;
  setMapa: React.Dispatch<React.SetStateAction<L.Map>>;
  conteudoElementosRef: React.MutableRefObject<tipoElemento[]>;
}) {
  const { setMapa, conteudoElementosRef } = propsMapa;
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
  const moveStartedRef = useRef<boolean>(false);

  useEffect(() => {
    if (map && !isMounted) {
      map.on("moveend", () => {
        if (!moveStartedRef.current)
          setTimeout(() => {
            if (
              !mapaContext.center ||
              map.distance(mapaContext.center, map.getCenter()) > 1
            ) {
              dispatch({ type: "alteraPropriedadesMapa", map: map });
            }
          }, 100);
        else moveStartedRef.current = false;
      });
      setMapa(map);
      setIsMounted(true);
    }
  }, [map, isMounted, mapaContext, dispatch, setMapa]);

  const center = useMemo(
    () => new LatLng(position[0], position[1]),
    [position]
  );
  const zoom = mapaContext.modoVisao === MODO_VISAO.openstreetmap ? 15 : 9;
  useEffect(() => {
    if (map != null) {
      moveStartedRef.current = true;
      map.setView(center, zoom);
    }
  }, [mapaContext.modoVisao, map, center, zoom]);

  const cliqueElementoNoMapa = (elemento, evento) => {
    if (evento.originalEvent.shiftKey || evento.originalEvent.ctrlKey)
      dispatch({ type: "adicionarElementoFoco", elemento: elemento });
    else dispatch({ type: "selecionarElementoFoco", elemento: elemento });
  };

  const urlImageRef = useRef<string>();
  const { openModalConfirm, closeModalConfirm, onConfirm } = useCaixaDialogo();

  //TODO: Função undo não pode reabrir popup de inserção de elemento????
  const handleDispatchInserirImageOverlay = React.useCallback(() => {
    dispatch({
      type: "adicionarImageOverlay",
      tipo: "ImageOverlay",
      valor: ImageResolver.UrlResolver(urlImageRef.current),
    });
    propsMapa.draw.setMode("select");
    closeModalConfirm(null, null);
    caixaDialogoRef.current = urlImageRef.current = null;
  }, [dispatch, closeModalConfirm, propsMapa.draw]);

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
    ) {
      moveStartedRef.current = true;
      map.setView(mapaContext.center, mapaContext.zoom);
    }
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

    // console.log("mapaContext", mapaContext);
    conteudoElementosRef.current =
      MapaContextChanger.retornaListaElementosConteudoCenaAtual(mapaContext);
  });

  const corItemSelecionadoFoco = (elemento) => {
    return MapaContextChanger.isElementoSelecionado(mapaContext, elemento.id)
      ? "#000000"
      : elemento.color ?? "#0d6efd";
  };

  const ConteudoMapa = (propsConteudoMapa: { elemento: elementoPadrao }) => {
    const elementoGeoJSON = new L.GeoJSON(propsConteudoMapa.elemento);
    useEffect(() => {
      if (map && propsMapa.draw) {
        if (propsConteudoMapa.elemento.draggable) {
          const ds = propsConteudoMapa.elemento as GeoJSONStoreFeatures;
          // TODO: inserir cor personalizada ou se estiver selecionado

          try {
            ds.bbox;
            propsMapa.draw?.addFeatures([ds]);
            if (
              mapaContext.elementoFoco?.id === propsConteudoMapa.elemento.id &&
              !(propsMapa.draw as any)._mode.selected?.some(
                (x) => x === propsConteudoMapa.elemento.id
              )
            )
              (propsMapa.draw as any)._mode.selected = [
                propsConteudoMapa.elemento.id,
              ];
            //(props.draw as any)._mode.onSelect(p.el.id);
          } catch (error) {
            console.error(error);
            dispatch({
              type: "removeElements",
              id: propsConteudoMapa.elemento.id,
            });
          }
        } else {
          elementoGeoJSON.on("click", () => {
            dispatch({
              type: "selecionarElementoFoco",
              id: propsConteudoMapa.elemento.id,
            });
          });
          elementoGeoJSON.setStyle({
            color: corItemSelecionadoFoco(propsConteudoMapa.elemento),
          });
          map.addLayer(elementoGeoJSON);
        }
        return () => {
          // props.draw.removeFeatures([p.el.id.toString()]);
          if (
            propsConteudoMapa.elemento.draggable ||
            Object.keys((propsMapa.draw as any)._store.store).some(
              (x) => x === propsConteudoMapa.elemento.id
            )
          ) {
            // if (mapaContext.elementoFoco?.id === p.el.id)
            //   (props.draw as any)._mode.deselect();
            if (
              MapaContextChanger.retornaListaElementosConteudo(
                mapaContext
              ).some(
                (elemento) => elemento.id === propsConteudoMapa.elemento.id
              )
            ) {
              // props.draw.removeFeatures([p.el.id.toString()]);
              if (
                (propsMapa.draw as any)._store &&
                (propsMapa.draw as any)._store.store[
                  propsConteudoMapa.elemento.id.toString()
                ]
              )
                propsMapa.draw.removeFeatures([
                  propsConteudoMapa.elemento.id.toString(),
                ]);
            }
          } else {
            map.removeLayer(elementoGeoJSON);
          }
        };
      }
    });
    return null;
  };

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

  return (
    <Grid item xs>
      <div style={{ height: propsMapa.altura, display: "grid" }}>
        <MapContainer
          center={mapaContext.mapOptions?.center ?? center}
          zoom={mapaContext.mapOptions?.zoom ?? zoom}
          ref={setMap}
          maxZoom={23}
        >
          {mapaContext.modoVisao === MODO_VISAO.openstreetmap && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxNativeZoom={19}
              maxZoom={23}
            />
          )}
          {mapaContext.modoVisao === MODO_VISAO.mapaProprio && (
            <ImageOverlay bounds={bounds} url={mapaContext.urlMapaProprio} />
          )}
          {mapaContext.conteudo &&
            mapaContext.conteudo.Marker &&
            mapaContext.conteudo.Marker.length > 0 &&
            mapaContext.conteudo.Marker.filter(
              (marker) =>
                new Date(marker.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(marker.cenaFim) >= new Date(mapaContext.tempo)
            ).map((marker, index, origin) => {
              return (
                marker.geometry?.coordinates && (
                  <Marker
                    {...marker}
                    position={marker.geometry.coordinates as [number, number]}
                    draggable={
                      marker.draggable &&
                      MapaContextChanger.isElementoSelecionado(
                        mapaContext,
                        marker.id
                      )
                    }
                    icon={divIcon({
                      className: "",
                      html: ReactDOMServer.renderToString(
                        <LocationOn
                          id={marker.id}
                          style={{
                            color: corItemSelecionadoFoco(marker),
                            position: "absolute",
                            top: "-150%",
                            left: "-67%",
                          }}
                        />
                      ),
                    })}
                    key={`marker#${index}`}
                    eventHandlers={{
                      click: (e) => cliqueElementoNoMapa(origin[index], e),
                      // MapaContextChanger.isElementoSelecionado(
                      //   mapaContext,
                      //   marker.id
                      // )
                      //   ? null
                      //   : cliqueElementoNoMapa(origin[index], e),
                      moveend: (e) => {
                        dispatch({
                          type: "editarPropriedade",
                          tipo: marker.dataRef,
                          id: marker.id,
                          nomePropriedade: "geometry",
                          valorPropriedade: {
                            ...marker.geometry,
                            coordinates: [
                              e.sourceTarget._latlng.lat,
                              e.sourceTarget._latlng.lng,
                            ],
                          },
                        });
                      },
                    }}
                  >
                    {MapaContextChanger.isElementoSelecionado(
                      mapaContext,
                      marker.id
                    ) && (
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
                        </ButtonGroup>
                      </Popup>
                    )}
                  </Marker>
                )
              );
            })}
          {mapaContext.conteudo &&
            mapaContext.conteudo.Point &&
            mapaContext.conteudo.Point.length > 0 &&
            mapaContext.conteudo.Point.filter(
              (point) =>
                new Date(point.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(point.cenaFim) >= new Date(mapaContext.tempo)
            ).map((point, index) => {
              return <ConteudoMapa elemento={point} key={`Pointer#${index}`} />;
            })}
          {mapaContext.conteudo &&
            mapaContext.conteudo.Circle &&
            mapaContext.conteudo.Circle.length > 0 &&
            mapaContext.conteudo.Circle.filter(
              (circle) =>
                new Date(circle.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(circle.cenaFim) >= new Date(mapaContext.tempo)
            ).map((circle, index) => {
              return <ConteudoMapa elemento={circle} key={`Circle#${index}`} />;
            })}
          {mapaContext.conteudo &&
            mapaContext.conteudo.LineString &&
            mapaContext.conteudo.LineString.length > 0 &&
            mapaContext.conteudo.LineString.filter(
              (lineString) =>
                new Date(lineString.cenaInicio) <=
                  new Date(mapaContext.tempo) &&
                new Date(lineString.cenaFim) >= new Date(mapaContext.tempo)
            ).map((lineString, index) => {
              return (
                <ConteudoMapa
                  elemento={lineString}
                  key={`LineString#${index}`}
                />
              );
            })}

          {mapaContext.conteudo &&
            mapaContext.conteudo.Polygon &&
            mapaContext.conteudo.Polygon.length > 0 &&
            mapaContext.conteudo.Polygon.filter(
              (polygon) =>
                new Date(polygon.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(polygon.cenaFim) >= new Date(mapaContext.tempo)
            ).map((polygon, index) => {
              return (
                <ConteudoMapa elemento={polygon} key={`polygon#${index}`} />
              );
            })}

          {mapaContext.conteudo &&
            mapaContext.conteudo.cenas &&
            mapaContext.conteudo.cenas.length > 0 &&
            mapaContext.conteudo.cenas
              .filter(
                (cena) =>
                  !!cena.exibirLimite &&
                  new Date(cena.cenaInicio) <= new Date(mapaContext.tempo) &&
                  new Date(cena.cenaFim) >= new Date(mapaContext.tempo)
              )
              .map((cena, index) => {
                return cena?.bounds ? (
                  <Rectangle
                    {...cena}
                    bounds={cena.bounds}
                    className="background-scene"
                    key={`Rectangle#${index}`}
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
              (image) =>
                new Date(image.cenaInicio) <= new Date(mapaContext.tempo) &&
                new Date(image.cenaFim) >= new Date(mapaContext.tempo)
            ).map((image, index) => {
              return (
                <ImageOverlayRotated
                  key={`ImageOverlay#${index}`}
                  x={image}
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
