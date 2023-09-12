import { Dispatch, createContext, useContext, useReducer } from "react";
import React from "react";
import { mapaReducer } from "./MapaDispatchEvents";
import { elementos } from "@/main/constants/elementos";
import { mapaContextSchema, actionContextChange } from "./mapaContextTypes";
import { v4 } from "uuid";

const initialMapaContexto: mapaContextSchema = {
  elementoInteracao: elementos.Hand,
  slidePropriedade: false,
  conteudo: {},
  cenaInicio: "2023-08-18",
  cenaFim: "2023-09-30",
  cenas: [
    {
      cenaInicio: "2023-08-18",
      cenaFim: "2023-09-30",
      id: v4(),
      nome: "Primeira cena",
    },
  ],
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
