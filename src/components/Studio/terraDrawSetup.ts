import React from "react";
import {
  TerraDraw,
  TerraDrawLeafletAdapter,
  TerraDrawSelectMode,
  TerraDrawPolygonMode,
  TerraDrawPointMode,
  TerraDrawLineStringMode,
  TerraDrawCircleMode,
  TerraDrawRenderMode,
} from "terra-draw";
import { actionContextChange, tipoElemento } from "../Mapa/mapaContextTypes";
import Leaflet from "leaflet";
import { elementos } from "@/main/constants/elementos";

const terraDrawSetup = (
  dispatch: React.Dispatch<actionContextChange>,
  map: Leaflet.Map,
  pegarConteudoElementos: () => tipoElemento[],
  alterarEventTimeoutConteudoElemento: (index: number, value: any) => void
) => {
  const terraDrawPolygonMode = new TerraDrawPolygonMode({
    allowSelfIntersections: false,
    pointerDistance: 30,
  });
  const terraDrawPointMode = new TerraDrawPointMode({});
  const terraDrawCircleMode = new TerraDrawCircleMode({});
  const terraDrawMarkerMode = new TerraDrawRenderMode({
    modeName: "marker",
    styles: {},
  });
  const terraDrawImageOverlayMode = new TerraDrawRenderMode({
    modeName: "ImageOverlay",
    styles: {},
  });
  const terraDrawLineStringMode = new TerraDrawLineStringMode({});
  const modelFlagsDefault = {
    feature: {
      scaleable: true,
      rotateable: true,
      draggable: true,
      coordinates: {
        midpoints: true,
        draggable: true,
        deletable: true,
      },
    },
  };
  const terraDrawSelectMode = new TerraDrawSelectMode({
    flags: {
      // Following flags determine what you can do in
      // select mode for features of a given mode - in this case polygon
      polygon: modelFlagsDefault,
      linestring: modelFlagsDefault,
      point: modelFlagsDefault,
      circle: {
        ...modelFlagsDefault,
        feature: {
          ...modelFlagsDefault.feature,
          coordinates: {
            ...modelFlagsDefault.feature.coordinates,
            midpoints: false,
          },
        },
      },
    },
    styles: {
      selectedPolygonColor: "#222222", // Any hex color you like
      selectedPolygonFillOpacity: 0.7, // 0 - 1
      selectedPolygonOutlineColor: "#333333", // Any hex color you like
      selectedPolygonOutlineWidth: 3, // Integer
      selectionPointWidth: 3,
      selectionPointColor: "#000000",
      selectionPointOutlineColor: "#000000",
      selectionPointOutlineWidth: 3,
      midPointColor: "#000000",
      midPointOutlineColor: "#000000",
      midPointWidth: 2,
      midPointOutlineWidth: 2,
      selectedPointColor: "#000000",
      selectedPointWidth: 2,
      selectedPointOutlineColor: "#000000",
      selectedPointOutlineWidth: 2,
      selectedLineStringColor: "#000000",
      selectedLineStringWidth: 3,
    },
  });

  (function (modes) {
    modes.forEach((mode) => {
      var oldEvent = mode.origin[mode.eventName];
      mode.origin[mode.eventName] = (e: any, f: any) => {
        try {
          oldEvent.apply(mode.origin, [e, f]);
        } catch (error) {
          /* empty */
        }
      };
    });
  })([
    { origin: terraDrawSelectMode, eventName: "onDragStart" },
    { origin: terraDrawSelectMode, eventName: "onDrag" },
  ]);

  const terraDrawLeafletAdapter = new TerraDrawLeafletAdapter({
    // The leaflet library object
    lib: Leaflet,

    // The leaflet map object we created
    map: map,

    // The decimal precision of the coordinates created
    coordinatePrecision: 9,
  });

  const draw = new TerraDraw({
    adapter: terraDrawLeafletAdapter,

    // Modes is an object containing all the modes we wish to
    // instantiate Terra Draw with
    modes: [
      terraDrawPointMode,
      terraDrawCircleMode,
      terraDrawPolygonMode,
      terraDrawLineStringMode,
      terraDrawSelectMode,
      terraDrawMarkerMode,
      terraDrawImageOverlayMode,
    ],
  });

  // var oldEvent = terraDrawLeafletAdapter.render;
  // terraDrawLeafletAdapter.render = (e, c) => {
  //   oldEvent.apply(terraDrawLeafletAdapter, [e, c]);
  // };

  (terraDrawMarkerMode.onClick as any) = (e: any) => {
    dispatch({
      type: "addElemento",
      posicao: [e.lat, e.lng],
      tipo: "Marker",
    });
    setTimeout(() => {
      draw.setMode(elementos.Hand.nome);
      dispatch({ type: "selecionarElementoInteracao", arg: elementos.Hand });
    }, 10);
  };

  terraDrawImageOverlayMode.onClick = () => {
    dispatch({
      type: "addImageOverlay",
    });
    setTimeout(() => {
      draw.setMode(elementos.Hand.nome);
      dispatch({ type: "selecionarElementoInteracao", arg: elementos.Hand });
    }, 10);
  };

  const onFinishModesExistents = (e: any) => {
    const element = draw.getSnapshot().find((x) => x.id === e);
    dispatch({
      type: "addElemento",
      posicao: element.geometry.coordinates as
        | [number, number]
        | [number, number][],
      tipo: element.geometry.type,
      id: element.id,
      valor: element,
    });
    draw.removeFeatures([e]);
    setTimeout(() => {
      draw.setMode(elementos.Hand.nome);
      dispatch({ type: "selecionarElementoInteracao", arg: elementos.Hand });
    }, 10);
  };

  terraDrawLineStringMode.onFinish =
    terraDrawCircleMode.onFinish =
    terraDrawPointMode.onFinish =
    terraDrawPolygonMode.onFinish =
      onFinishModesExistents;

  draw.on("change", (e: string[], type: string) => {
    const listaEl = pegarConteudoElementos();
    if (listaEl.some((x) => e.some((z) => z === x.id))) {
      switch (type) {
        case "update":
          {
            const element = draw
              .getSnapshot()
              .find(
                (x) =>
                  e.some((z) => z === x.id) &&
                  listaEl.some((z) => z.id === x.id)
              );
            const oldElement = listaEl.find((x) => x.id === element.id);
            if (oldElement)
              if (
                JSON.stringify(oldElement.geometry.coordinates.flat()) !==
                JSON.stringify(element.geometry.coordinates.flat())
              ) {
                if (oldElement.eventTimeout) {
                  clearTimeout(oldElement.eventTimeout);
                }
                alterarEventTimeoutConteudoElemento(
                  listaEl.findIndex((x) => x.id === oldElement.id),
                  setTimeout(() => {
                    if (
                      listaEl[listaEl.findIndex((x) => x.id === oldElement.id)]
                        .eventTimeout !== null
                    ) {
                      dispatch({
                        type: "alteraCoordinatesElemento",
                        posicao: element.geometry.coordinates as
                          | [number, number]
                          | [number, number][]
                          | [number, number][][],
                        id: element.id,
                      });
                      alterarEventTimeoutConteudoElemento(
                        listaEl.findIndex((x) => x.id === oldElement.id),
                        null
                      );
                    }
                  }, 100)
                );
              }
            // });
          }
          break;

        default:
          break;
      }
    }
  });

  // Start drawing
  draw.start();
  // Set the mode to polygon
  draw.setMode("select");

  return draw;
};
export default terraDrawSetup;
