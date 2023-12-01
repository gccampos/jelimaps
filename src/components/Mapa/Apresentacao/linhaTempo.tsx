"use client";
import Leaflet, { divIcon } from "leaflet";
import React, { useState } from "react";
import { useMapaContext, useMapaDispatch } from "@/components/Mapa/MapaContext";
import { LocationOn } from "@mui/icons-material";
import ReactDOMServer from "react-dom/server";
import { elementoPadrao } from "../mapaContextTypes";
import "leaflet.timeline/dist/Timeline";
import "leaflet.timeline/dist/TimelineSliderControl";
import "leaflet.path.drag";
import "leaflet-imageoverlay-rotated";
import { useMap } from "react-leaflet";
import moment from "moment";

const ConteudoMapa = (propsConteudoMapa: {
  elemento?: elementoPadrao;
  timelineSliderControl?: Leaflet.TimelineSliderControl;
  functionInit?: () => void;
  functionDispose?: () => void;
}) => {
  const map = useMap();
  const { timelineSliderControl, elemento, functionInit, functionDispose } =
    propsConteudoMapa;
  const timelineGeoJSON = (
    !functionInit
      ? {
          type: "FeatureCollection",
          features: [
            {
              ...elemento,
              properties: {
                ...elemento.properties,
                start: elemento.cenaInicio,
                end: elemento.cenaFim,
              },
            },
          ],
        }
      : {}
  ) as { type: "FeatureCollection" };
  const elementoGeoJSON =
    !functionInit && new Leaflet.Timeline(timelineGeoJSON);
  React.useEffect(() => {
    if (map) {
      if (functionInit) functionInit();
      else {
        timelineSliderControl.addTimelines(elementoGeoJSON);
        map.addLayer(elementoGeoJSON);
      }
      return () => {
        if (functionDispose) functionDispose();
        else {
          timelineSliderControl.removeTimelines(elementoGeoJSON);
          map.removeLayer(elementoGeoJSON);
        }
      };
    }
  });
  return null;
};

const LinhaTempo = () => {
  const map = useMap();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [timelineSliderControl, setTimelineSliderControl] =
    useState<Leaflet.TimelineSliderControl>();
  const [tempoAtual, setTempoAtual] = useState(null);

  React.useEffect(() => {
    if (!timelineSliderControl) {
      const leafletTimelineSlider = new Leaflet.TimelineSliderControl({});
      leafletTimelineSlider.options.formatOutput = (date) => {
        return new Date(date).toString();
      };
      leafletTimelineSlider.options.waitToUpdateMap = true;

      setTimelineSliderControl(leafletTimelineSlider);
      leafletTimelineSlider.addTo(map);
    }
  }, [map, timelineSliderControl]);

  const handleListenerSlider = React.useCallback(
    (e: any) => {
      if (
        moment(parseInt(e.target.value)).format("yyyy-MM-DDTHH:mm:ss") !=
          "Invalid date" &&
        moment(parseInt(e.target.value)).format("yyyy-MM-DDTHH:mm:ss") !=
          tempoAtual
      )
        setTempoAtual(
          moment(parseInt(e.target.value)).format("yyyy-MM-DDTHH:mm:ss")
        );
    },
    [tempoAtual]
  );

  React.useEffect(() => {
    if (timelineSliderControl) {
      (document.getElementsByClassName("time-slider")[0] as any).onchange =
        handleListenerSlider;
    }
  }, [timelineSliderControl, handleListenerSlider]);

  React.useEffect(() => {
    if (timelineSliderControl && tempoAtual && tempoAtual != "Invalid date") {
      dispatch({
        type: "atualizaTempo",
        time: tempoAtual,
      });
    }
  }, [dispatch, tempoAtual, timelineSliderControl]);

  React.useEffect(() => {
    if (timelineSliderControl)
      timelineSliderControl.setTime(new Date(mapaContext.tempo).getTime());
  }, [mapaContext.tempo, timelineSliderControl]);

  return (
    timelineSliderControl && (
      <>
        {mapaContext.conteudo &&
          mapaContext.conteudo.Marker &&
          mapaContext.conteudo.Marker.length > 0 &&
          mapaContext.conteudo.Marker.map((marker, index) => {
            const icon = divIcon({
              className: "",
              html: ReactDOMServer.renderToString(
                <LocationOn
                  id={marker.id}
                  style={{
                    color: marker.color,
                    position: "absolute",
                    top: "-150%",
                    left: "-67%",
                  }}
                />
              ),
            });
            const pureMarker = Leaflet.marker(
              marker.geometry.coordinates as [number, number]
            );

            const markerTimeline = {
              ...pureMarker.toGeoJSON(),
              properties: {
                ...pureMarker.toGeoJSON().properties,
                ...marker.properties,
                start: marker.cenaInicio,
                end: marker.cenaFim,
              },
            };
            const featureCollectionTimeline = {
              type: "FeatureCollection",
              features: [markerTimeline],
            } as { type: "FeatureCollection" };

            const markerLeaflet = new Leaflet.Timeline(
              featureCollectionTimeline
            );
            return (
              <ConteudoMapa
                elemento={marker}
                key={`Pointer#${index}`}
                timelineSliderControl={timelineSliderControl}
                functionInit={() => {
                  timelineSliderControl.addTimelines(markerLeaflet);
                  map.addLayer(markerLeaflet);

                  markerLeaflet.addEventListener("change", (e) => {
                    setTimeout(() => {
                      e.target.eachLayer((x) => {
                        (x as Leaflet.Marker<any>).setIcon(icon);
                      });
                    }, 10);
                  });
                }}
                functionDispose={() => {
                  timelineSliderControl.removeTimelines(markerLeaflet);
                  map.removeLayer(markerLeaflet);
                }}
              />
            );
          })}
        {mapaContext.conteudo &&
          mapaContext.conteudo.Point &&
          mapaContext.conteudo.Point.length > 0 &&
          mapaContext.conteudo.Point
            // .filter(
            //   (point) =>
            //     new Date(point.cenaInicio) <= new Date(tempoAtualRef.current) &&
            //     new Date(point.cenaFim) >= new Date(tempoAtualRef.current)
            // )
            .map((point, index) => {
              return (
                <ConteudoMapa
                  elemento={point}
                  key={`Pointer#${index}`}
                  timelineSliderControl={timelineSliderControl}
                />
              );
            })}
        {mapaContext.conteudo &&
          mapaContext.conteudo.Circle &&
          mapaContext.conteudo.Circle.length > 0 &&
          mapaContext.conteudo.Circle
            // .filter(
            //   (circle) =>
            //     new Date(circle.cenaInicio) <= new Date(tempoAtualRef.current) &&
            //     new Date(circle.cenaFim) >= new Date(tempoAtualRef.current)
            // )
            .map((circle, index) => {
              return (
                <ConteudoMapa
                  elemento={circle}
                  key={`Circle#${index}`}
                  timelineSliderControl={timelineSliderControl}
                />
              );
            })}
        {mapaContext.conteudo &&
          mapaContext.conteudo.LineString &&
          mapaContext.conteudo.LineString.length > 0 &&
          mapaContext.conteudo.LineString
            // .filter(
            //   (lineString) =>
            //     new Date(lineString.cenaInicio) <= new Date(tempoAtualRef.current) &&
            //     new Date(lineString.cenaFim) >= new Date(tempoAtualRef.current)
            // )
            .map((lineString, index) => {
              return (
                <ConteudoMapa
                  elemento={lineString}
                  key={`LineString#${index}`}
                  timelineSliderControl={timelineSliderControl}
                />
              );
            })}

        {mapaContext.conteudo &&
          mapaContext.conteudo.Polygon &&
          mapaContext.conteudo.Polygon.length > 0 &&
          mapaContext.conteudo.Polygon
            // .filter(
            //   (polygon) =>
            //     new Date(polygon.cenaInicio) <= new Date(tempoAtualRef.current) &&
            //     new Date(polygon.cenaFim) >= new Date(tempoAtualRef.current)
            // )
            .map((polygon, index) => {
              return (
                <ConteudoMapa
                  elemento={polygon}
                  key={`polygon#${index}`}
                  timelineSliderControl={timelineSliderControl}
                />
              );
            })}

        {mapaContext.conteudo &&
          mapaContext.conteudo.ImageOverlay &&
          mapaContext.conteudo.ImageOverlay.length > 0 &&
          mapaContext.conteudo.ImageOverlay
            // .filter(
            //   (image) =>
            //     new Date(image.cenaInicio) <= new Date(tempoAtual) &&
            //     new Date(image.cenaFim) >= new Date(tempoAtual)
            // )
            .map((image, index) => {
              let im = (Leaflet.imageOverlay as any).rotated(
                image.urlImagem,
                image.positionTL,
                image.positionTR,
                image.positionBL
              );

              const featureCollectionTimeline = {
                type: "FeatureCollection",
                features: [
                  {
                    ...im,
                    properties: {
                      ...image.properties,
                      start: image.cenaInicio,
                      end: image.cenaFim,
                    },
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: image.positionBL,
                    },
                  },
                ],
              } as { type: "FeatureCollection" };

              const imageLeaflet = new Leaflet.Timeline(
                featureCollectionTimeline
              );
              return (
                <ConteudoMapa
                  key={`ImageOverlay#${index}`}
                  functionInit={() => {
                    if ((Leaflet.imageOverlay as any).rotated) {
                      im = (Leaflet.imageOverlay as any).rotated(
                        image.urlImagem,
                        image.positionTL,
                        image.positionTR,
                        image.positionBL
                      );
                      timelineSliderControl.addTimelines(imageLeaflet);
                      if (
                        imageLeaflet.ranges.lookup(
                          parseInt(
                            timelineSliderControl.container.getElementsByTagName(
                              "input"
                            )[0].value
                          )
                        ).length
                      )
                        map.addLayer(im);
                      imageLeaflet.addEventListener("change", () => {
                        try {
                          if (
                            imageLeaflet.ranges.lookup(
                              parseInt(
                                timelineSliderControl.container.getElementsByTagName(
                                  "input"
                                )[0].value
                              )
                            ).length &&
                            map &&
                            map.addLayer
                          )
                            map.addLayer(im);
                          else map.removeLayer(im);
                        } catch (error) {
                          console.log(error);
                        }
                      });
                    }
                  }}
                  functionDispose={() => {
                    timelineSliderControl.removeTimelines(im);
                    map.removeLayer(im);
                  }}
                />
              );
            })}
      </>
    )
  );
};

export default LinhaTempo;
