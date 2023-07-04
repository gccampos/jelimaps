import { elementoProto } from "@/main/constants/elementos";
import { LatLng, LatLngBoundsExpression } from "leaflet";

export type elementoPadrao = {
  nome: string;
  collapse?: boolean;
  dataRef?: string;
  texto?: string;
  color?: string;
  draggable?: boolean;
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
type basePrototypeArray = { collapse?: boolean };
type arrayElementoPadrao = basePrototypeArray & elementoPadrao[];
type arrayElementoGenerico<T> = basePrototypeArray & T[];

export type actionContextChange = {
  type: string;
  arg?: elementoProto;
  tipo?: string;
  posicao?: LatLng;
  indiceElemento?: number;
  nomeElemento?: string;
  nomePropriedade?: string;
  valorPropriedade?: string;
  valorBooleano?: boolean;
};
