import { createContext, useContext, useReducer } from "react";
import React from "react";
import { mapaReducer } from "./MapaDispatchEvents";
import MapaFunctionHelpers from "./MapaFunctionsHelpers";
import { elementoProto, elementos } from "@/main/constants/elementos";
import { MODO_VISAO } from "@/components/Studio/Mapa";
import { LatLng, LatLngBoundsExpression } from "leaflet";

const initialMapaContexto: mapaContextSchema = {
  elementoAdd: elementos.Hand,
  conteudo: null,
};

type elementoComPosition = {
  position: LatLng;
};
type elementoCircle = {
  center: LatLng;
  radius: number;
};
type elementoComPositions = {
  positions: LatLng[];
};
type elementoComBounds = {
  bounds: LatLngBoundsExpression;
};
export type mapaContextSchema = {
  elementoAdd: elementoProto;
  modoVisao?: keyof typeof MODO_VISAO;
  conteudo: {
    Marker: ({ dataRef: string } & elementoComPosition)[];
    Polyline: elementoComPositions[];
    Polygon: elementoComPositions[];
    Circle: elementoCircle[];
    Rectangle: elementoComBounds[];
  };
};

const MapaContext = createContext<mapaContextSchema>(initialMapaContexto);
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
