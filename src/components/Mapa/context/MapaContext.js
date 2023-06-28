import { createContext, useContext, useReducer } from "react";
import React from "react";
import { mapaReducer } from "./MapaDispatchEvents";
import MapaFunctionHelpers from "./MapaFunctionsHelpers";

const initialMapaContexto = {
  elemento: null,
  conteudo: null,
  modoVisao: "",
};
const MapaContext = createContext(initialMapaContexto);
export function useMapaContext() {
  return useContext(MapaContext);
}

const MapaDispatchContext = createContext(({ ...initialMapaContexto }) => {});
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
