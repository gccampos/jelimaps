import { Dispatch, createContext, useContext, useReducer } from "react";
import React from "react";
import { mapaReducer } from "./MapaDispatchEvents";
import { elementos } from "@/main/constants/elementos";
import { mapaContextSchema, actionContextChange } from "./mapaContextTypes";
import { v4 } from "uuid";
import moment from "moment";

const initialMapaContexto: mapaContextSchema = {
  elementoInteracao: elementos.Hand,
  slidePropriedade: false,
  cenaInicio: moment().format("yyyy-MM-DDTHH:mm:ss"),
  cenaFim: moment().add(1, "minutes").format("yyyy-MM-DDTHH:mm:ss"),
  tempo: moment().add(2, "seconds").format("yyyy-MM-DDTHH:mm:ss"),
  mapOptions: {
    center: [0, 0],
  },
  playStatus: -1,
  conteudo: {
    cenas: [
      {
        cenaInicio: moment().format("yyyy-MM-DDTHH:mm:ss"),
        cenaFim: moment().add(1, "minute").format("yyyy-MM-DDTHH:mm:ss"),
        id: v4(),
        nome: "Primeira cena",
        dataRef: "cenas",
        visTimelineObject: {
          type: "background",
        },
        type: "FeatureCollection",
        style: "background-color: #df000024;",
      },
    ],
  },
  timelineOptions: {
    editable: { remove: true, updateTime: true },
    zoomKey: "ctrlKey",
    preferZoom: true,
    start: moment().format("yyyy-MM-DDTHH:mm:ss"),
    end: moment().add(10, "minutes").format("yyyy-MM-DDTHH:mm:ss"),
    autoResize: false,
    selectable: true,
    multiselect: true,
    orientation: { axis: "both" },
    longSelectPressTime: 777,
    snap: (date) => date,
    rollingMode: { offset: 0, follow: false },
    showCurrentTime: false,
    groupEditable: { order: true },
    groupHeightMode: "fitItems",
  },
};

const MapaContext = createContext<mapaContextSchema>(initialMapaContexto);
export function useMapaContext() {
  return useContext(MapaContext);
}

const MapaDispatchContext = createContext<Dispatch<actionContextChange>>(
  () => {}
);
export function useMapaDispatch() {
  return useContext(MapaDispatchContext);
}

export function MapaProvider({ children }) {
  const [mapaContexto, dispatch] = useReducer(mapaReducer, initialMapaContexto);

  return (
    <MapaContext.Provider value={mapaContexto}>
      <MapaDispatchContext.Provider value={dispatch}>
        {children}
      </MapaDispatchContext.Provider>
    </MapaContext.Provider>
  );
}
