import { Dispatch, createContext, useContext, useReducer } from "react";
import React from "react";
import { mapaReducer } from "./MapaDispatchEvents";
import { elementoProto, elementos } from "@/main/constants/elementos";
import { LatLng, LatLngBoundsExpression } from "leaflet";

const initialMapaContexto: mapaContextSchema = {
  elementoAdd: elementos.Hand,
  slidePropriedade: false,
  conteudo: null,
};

export type elementoPadrao = {
  nome: string;
  selecionado?: boolean;
  dataRef?: string;
};
export type elementoComPosition = {
  position: LatLng;
} & elementoPadrao;
export type elementoCircle = {
  center: LatLng;
  radius: number;
} & elementoPadrao;
export type elementoComPositions = {
  positions: LatLng[];
} & elementoPadrao;
export type elementoComBounds = {
  bounds: LatLngBoundsExpression;
} & elementoPadrao;
export type mapaContextSchema = {
  elementoAdd: elementoProto;
  slidePropriedade: boolean;
  modoVisao?: string;
  conteudo: conteudoType & {
    Marker: markerType;
    Polyline: PolylineType;
    Polygon: PolygonType;
    Circle: CircleType;
    Rectangle: RectangleType;
  };
};

type conteudoType = {
  [key: string]: arrayElementoPadrao;
};

export type markerType = arrayElementoGenerico<elementoComPosition>;
export type PolylineType = arrayElementoGenerico<elementoComPositions>;
export type PolygonType = arrayElementoGenerico<elementoComPositions>;
export type CircleType = arrayElementoGenerico<elementoCircle>;
export type RectangleType = arrayElementoGenerico<elementoComBounds>;

type basePrototypeArray = { aberto?: boolean };
type arrayElementoPadrao = basePrototypeArray & elementoPadrao[];
type arrayElementoGenerico<T> = basePrototypeArray & T[];

export type actionContextChange = {
  type: string;
  arg?: elementoProto;
  tipo?: string;
  posicao?: LatLng;
  indiceElemento?: number;
  nomeElemento?: string;
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
