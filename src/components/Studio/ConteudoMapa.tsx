import { useEffect } from "react";
import { elementoPadrao } from "../Mapa/mapaContextTypes";
import Leaflet from "leaflet";
import { useMap } from "react-leaflet";
import { GeoJSONStoreFeatures, TerraDraw } from "terra-draw";
import { useMapaContext, useMapaDispatch } from "../Mapa/MapaContext";
import MapaContextChanger from "../Mapa/ContextChangers";
import { elementos } from "@/main/constants/elementos";

const ConteudoMapa = (propsConteudoMapa: {
  elemento: elementoPadrao;
  draw: TerraDraw;
}) => {
  const map = useMap();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  const corItemSelecionadoFoco = (elemento) => {
    return MapaContextChanger.isElementoSelecionado(mapaContext, elemento.id)
      ? "#000000"
      : elemento.color ?? "#0d6efd";
  };

  const functionRemoveDraw = () => {
    if (
      MapaContextChanger.retornaListaElementosConteudo(mapaContext).some(
        (elemento) => elemento.id === propsConteudoMapa.elemento.id
      )
    ) {
      if (
        (propsConteudoMapa.draw as any)._store &&
        (propsConteudoMapa.draw as any)._store.store[
          propsConteudoMapa.elemento.id.toString()
        ]
      )
        propsConteudoMapa.draw.removeFeatures([
          propsConteudoMapa.elemento.id.toString(),
        ]);
      return true;
    }
    return false;
  };

  function selecionarElementoPeloDraw() {
    if (
      !(propsConteudoMapa.draw as any)._mode.selected.includes(
        propsConteudoMapa.elemento.id
      )
    )
      propsConteudoMapa.draw.selectFeature(propsConteudoMapa.elemento.id);
  }

  useEffect(() => {
    const elementoGeoJSON = new Leaflet.GeoJSON(propsConteudoMapa.elemento);

    function insereElementoSemDraw() {
      elementoGeoJSON.on("click", () => {
        dispatch({
          type: "selecionarElementoFoco",
          id: propsConteudoMapa.elemento.id,
          mapContext: {
            ...mapaContext,
            bounds: elementoGeoJSON.getBounds(),
            center: elementoGeoJSON.getBounds().getCenter(),
            zoom: propsConteudoMapa.elemento.zoom,
          },
        });

        // // para evitar de arrastar o elemento no mapa sem querer
        // setTimeout(() => {
        //   // propsConteudoMapa.draw.setMode(elementos.Hand.nome);
        //   propsConteudoMapa.draw.selectFeature(propsConteudoMapa.elemento.id);
        // }, 500);
      });
      elementoGeoJSON.setStyle({
        color: corItemSelecionadoFoco(propsConteudoMapa.elemento),
      });
      map.addLayer(elementoGeoJSON);
    }

    if (map)
      if (propsConteudoMapa.draw) {
        if (
          propsConteudoMapa.elemento.draggable &&
          MapaContextChanger.isElementoSelecionado(
            mapaContext,
            propsConteudoMapa.elemento.id
          )
        ) {
          const elementoConteudo = {
            ...propsConteudoMapa.elemento,
            properties: {
              ...propsConteudoMapa.elemento.properties,
              selected: true,
            },
          } as GeoJSONStoreFeatures;
          try {
            propsConteudoMapa.draw?.addFeatures([elementoConteudo]);

            if ((propsConteudoMapa.draw as any)._mode.selected) {
              selecionarElementoPeloDraw();
            } else {
              (propsConteudoMapa.draw as any).setMode(elementos.Hand.nome);
              dispatch({
                type: "selecionarElementoInteracao",
                arg: elementos.Hand,
              });
              selecionarElementoPeloDraw();
            }
          } catch (error) {
            dispatch({
              type: "removeElements",
              id: propsConteudoMapa.elemento.id,
            });
          }
        } else {
          insereElementoSemDraw();
        }
        return () => {
          try {
            if (
              propsConteudoMapa.elemento.draggable &&
              MapaContextChanger.isElementoSelecionado(
                mapaContext,
                propsConteudoMapa.elemento.id
              )
            )
              functionRemoveDraw();
            else {
              map.removeLayer(elementoGeoJSON);
            }
          } catch (error) {
            if (!functionRemoveDraw()) {
              map.removeLayer(elementoGeoJSON);
            }
          }
        };
      } else {
        insereElementoSemDraw();

        return () => {
          map.removeLayer(elementoGeoJSON);
        };
      }
  });
  return null;
};

export default ConteudoMapa;
