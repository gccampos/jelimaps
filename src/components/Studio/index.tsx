import React, { useEffect, useRef, useState } from "react";
import Propriedades from "./Propriedades";
import LinhaTempo from "./LinhaTempo/Index";
import { Grid, styled } from "@mui/material";
import Mapa from "./Mapa";
import { Rnd } from "react-rnd";
import useWindowDimensions from "./useWindowDimensions";
import { ElementosLateral } from "./Elementos";
import L from "leaflet";
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
import { useMapaContext, useMapaDispatch } from "../Mapa/context/MapaContext";
import { tipoElemento } from "../Mapa/context/mapaContextTypes";
// import moment from "moment";

const Dragger = styled("div")`
  cursor: n-resize;
`;

const Studio = () => {
  const { height } = useWindowDimensions();
  const [rndRef, setRndRef] = useState<Rnd>();
  const [map, setMap] = useState<L.Map>();
  const conteudoElementosRef = useRef<tipoElemento[]>(null);
  const mapaContext = useMapaContext();
  const tempoAtualRef = useRef(null);
  const [draw, setDraw] = useState<TerraDraw>(null);
  const [altura, setAltura] = useState(height * 0.25);
  const displaYNoneStyle = { display: "none" };
  const [larguraPropriedades, setLargurasPropriedades] = useState(250);
  const dispatch = useMapaDispatch();

  const isMobile = React.useCallback(() => {
    return (
      "ontouchstart" in document.documentElement &&
      !!navigator.userAgent.match(/Mobi/)
    );
  }, []);

  useEffect(() => {
    if (map && !draw) {
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
          selectedPolygonOutlineWidth: 2, // Integer
        },
      });

      const terraDrawLeafletAdapter = new TerraDrawLeafletAdapter({
        // The leaflet library object
        lib: L,

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
      (terraDrawMarkerMode.onClick as any) = (e: any) => {
        dispatch({
          type: "addElemento",
          posicao: [e.lat, e.lng],
          tipo: "Marker",
        });
      };
      terraDrawImageOverlayMode.onClick = () => {
        dispatch({
          type: "addImageOverlay",
        });
      };
      (function (modes) {
        modes.forEach((mode) => {
          var oldEvent = mode.onClick;
          mode.origin.onClick = (e: any) => {
            if (
              !(
                e.containerY < 90 &&
                e.containerX > (map as any)._container.offsetWidth - 90
              ) &&
              !(e.containerX < 60 && e.containerY < 160)
              // e.containerX > (map as any)._container.offsetWidth - 70)
            ) {
              if (
                typeof terraDrawCircleMode === typeof mode.origin &&
                isMobile()
              ) {
                (mode.origin as any).clickCount =
                  (mode.origin as any).clickCount ?? 0;
                if ((mode.origin as any).clickCount === 1)
                  mode.origin.onMouseMove(e);
              }
              oldEvent.apply(mode.origin, [e]);
            }
          };
        });
      })([
        { origin: terraDrawCircleMode, onClick: terraDrawCircleMode.onClick },
        {
          origin: terraDrawLineStringMode,
          onClick: terraDrawLineStringMode.onClick,
        },
        { origin: terraDrawPointMode, onClick: terraDrawPointMode.onClick },
        { origin: terraDrawPolygonMode, onClick: terraDrawPolygonMode.onClick },
        { origin: terraDrawSelectMode, onClick: terraDrawSelectMode.onClick },
        { origin: terraDrawMarkerMode, onClick: terraDrawMarkerMode.onClick },
        {
          origin: terraDrawImageOverlayMode,
          onClick: terraDrawImageOverlayMode.onClick,
        },
      ]);

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
      };

      terraDrawLineStringMode.onFinish =
        terraDrawCircleMode.onFinish =
        terraDrawPointMode.onFinish =
        terraDrawPolygonMode.onFinish =
          onFinishModesExistents;

      draw.on("select", (id: string) => {
        dispatch({
          type: "selecionarElementoFoco",
          id: id,
        });
      });

      draw.on("deselect", () => {
        dispatch({
          type: "selecionarElementoFoco",
        });
      });

      draw.on("change", (e: string[], type: string) => {
        const listaEl = conteudoElementosRef.current;
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
                    conteudoElementosRef.current[
                      conteudoElementosRef.current.findIndex(
                        (x) => x.id === oldElement.id
                      )
                    ].eventTimeout = setTimeout(() => {
                      if (
                        conteudoElementosRef.current[
                          conteudoElementosRef.current.findIndex(
                            (x) => x.id === oldElement.id
                          )
                        ].eventTimeout !== null
                      ) {
                        dispatch({
                          type: "alteraCoordinatesElemento",
                          posicao: element.geometry.coordinates as
                            | [number, number]
                            | [number, number][]
                            | [number, number][][],
                          id: element.id,
                        });
                        conteudoElementosRef.current[
                          conteudoElementosRef.current.findIndex(
                            (x) => x.id === oldElement.id
                          )
                        ].eventTimeout = null;
                      }
                    }, 100);
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
      setDraw(draw);
      // Set the mode to polygon
      draw.setMode("select");
    }
  }, [altura, dispatch, draw, height, isMobile, map]);
  useEffect(() => {
    if (!(mapaContext.elementoFoco && mapaContext.elementosFoco))
      console.log("useEffect[draw, conteudoElementosRef.current]", draw);
    //TODO:selecionar elemento no draw
  }, [draw, mapaContext.elementoFoco, mapaContext.elementosFoco]);
  return (
    <Grid container sx={{ height: "100%" }} id="studioMapa">
      <Grid item container xs={12}>
        <ElementosLateral altura={height - altura} draw={draw} />
        <Mapa
          altura={height - altura}
          setMapa={setMap}
          draw={draw}
          conteudoElementosRef={conteudoElementosRef}
        />
        <Propriedades
          altura={height - altura}
          tempoAtualRef={tempoAtualRef}
          larguraPropriedades={larguraPropriedades}
          setLargurasPropriedades={setLargurasPropriedades}
        />
      </Grid>
      <Rnd
        ref={(c) => {
          setRndRef(c);
        }}
        maxHeight={height * 0.9}
        minHeight={height * 0.05}
        resizeHandleStyles={{
          bottom: displaYNoneStyle,
          left: displaYNoneStyle,
          right: displaYNoneStyle,
          topLeft: displaYNoneStyle,
          topRight: displaYNoneStyle,
          bottomLeft: displaYNoneStyle,
          bottomRight: displaYNoneStyle,
          top: { height: 25 },
        }}
        size={{ height: altura, width: "100%" }}
        disableDragging
        position={{ y: height - altura, x: 0 }}
        resizeHandleComponent={{
          top: (
            <Dragger
              sx={{
                borderStyle: "outset",
                borderBottom: 2,
                height: 20,
                backgroundColor: "#e2e2e2",
                marginTop: 0.6,
              }}
            ></Dragger>
          ),
        }}
        onResize={(e, dir, ref) => {
          if (rndRef && rndRef.updatePosition)
            rndRef?.updatePosition({ x: 0, y: height - ref.offsetHeight });
          setAltura(ref.offsetHeight);
        }}
      >
        <Grid
          item
          container
          xs={12}
          mt={2.2}
          sx={{ height: "95%", maxHeight: altura }}
        >
          <LinhaTempo tempoAtualRef={tempoAtualRef} altura={altura} />
        </Grid>
      </Rnd>
    </Grid>
  );
};

export default Studio;
