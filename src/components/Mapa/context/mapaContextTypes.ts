import React from "react";
import { elementoProto } from "@/main/constants/elementos";
import { LatLng, LatLngBoundsExpression } from "leaflet";
import { NIL } from "uuid";
import { DateType } from "vis-timeline";

export type tipoGenericoElementoTimeline = periodoInicioFim & {
  id: NIL;
  nome: string;
  dataRef?: string;
};
export type elementoPadrao = tipoGenericoElementoTimeline & {
  collapse?: boolean;
  texto?: string;
  color?: string;
  draggable?: boolean;
  propriedades?: propriedadeVisual[];
};
type periodoInicioFim = {
  cenaFim: DateType;
  cenaInicio: DateType;
};
type propriedadeVisual = tipoGenericoElementoTimeline & {
  nome: string;
  tipo: any;
  valor: any;
  form: React.ReactNode;
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
export type mapaContextSchema = periodoInicioFim & {
  elementoInteracao: elementoProto;
  elementoFoco?: tipoElemento;
  elementosFoco?: tipoElemento[];
  slidePropriedade: boolean;
  modoVisao?: string;
  conteudo: conteudoType & {
    Marker?: markerType;
    Polyline?: PolylineType;
    Polygon?: PolygonType;
    Circle?: CircleType;
    Rectangle?: RectangleType;
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
export type tipoElemento =
  | elementoPadrao
  | elementoComPosition
  | elementoComPositions
  | elementoComBounds;

export type actionContextChange = {
  type: string;
  id?: NIL;
  arg?: elementoProto;
  elemento?: tipoElemento;
  elementos?: tipoElemento[];
  tipo?: string;
  posicao?: LatLng;
  indiceElemento?: number;
  nomeElemento?: string;
  nomePropriedade?: string;
  valorPropriedade?: string;
  valorBooleano?: boolean;
  start?: DateType;
  end?: DateType;
};
