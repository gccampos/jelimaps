import { Dispatch, createContext, useContext, useReducer } from "react";
import React from "react";
import { mapaReducer } from "./MapaDispatchEvents";
import { elementos } from "@/main/constants/elementos";
import { mapaContextSchema, actionContextChange } from "./mapaContextTypes";

const initialMapaContexto: mapaContextSchema = {
  elementoInteracao: elementos.Hand,
  slidePropriedade: false,
  conteudo: {},
  cenaInicio: 1,
  cenaFim: 100,
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
