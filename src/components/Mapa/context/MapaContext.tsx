import { createContext, useContext, useReducer } from "react";
import React from "react";
import { mapaReducer } from "./MapaDispatchEvents";
import MapaFunctionHelpers from "./MapaFunctionsHelpers";
import { elementoProto, elementos } from "@/main/constants/elementos";
import { MODO_VISAO } from "@/components/Studio/Mapa";
import { LatLng, LatLngBoundsExpression } from "leaflet";

const initialMapaContexto: mapaContextSchema = {
  elementoAdd: elementos.Hand,
  slidePropriedade: false,
  conteudo: null,
};

type elementoPadrao = {
  nome: string;
};
type elementoComPosition = {
  position: LatLng;
} & elementoPadrao;
type elementoCircle = {
  center: LatLng;
  radius: number;
} & elementoPadrao;
type elementoComPositions = {
  positions: LatLng[];
} & elementoPadrao;
type elementoComBounds = {
  bounds: LatLngBoundsExpression;
} & elementoPadrao;
export type mapaContextSchema = {
  elementoAdd: elementoProto;
  slidePropriedade: boolean;
  modoVisao?: string;
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
