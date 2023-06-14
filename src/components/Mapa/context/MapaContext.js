import { createContext, useContext, useReducer } from "react";
import React from "react";
import { mapaReducer } from "./MapaDispatchEvents";

const MapaContext = createContext(null);
export function useMapaContext() {
  return useContext(MapaContext);
}

const MapaDispatchContext = createContext(null);
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

const initialMapaContexto = {
  center: 0,
};
