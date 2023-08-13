import React from "react";
import { elementoProto } from "@/main/constants/elementos";
import { LatLng, LatLngBoundsExpression } from "leaflet";
import { NIL } from "uuid";

export type elementoPadrao = periodoInicioFim & {
  id: NIL;
  //id: UniqueIdentifier;
  nome: string;
  collapse?: boolean;
  dataRef?: string;
  texto?: string;
  color?: string;
  draggable?: boolean;
  propriedades?: propriedadeVisual[];
};
type periodoInicioFim = {
  cenaFim: Date;
  cenaInicio: Date;
};
type propriedadeVisual = periodoInicioFim & {
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
  elementoFoco?: elementoPadrao;
  elementosFoco?: elementoPadrao[];
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

export type actionContextChange = {
  type: string;
  id?: NIL;
  arg?: elementoProto;
  elemento?:
    | elementoPadrao
    | elementoComPosition
    | elementoComPositions
    | elementoComBounds;
  tipo?: string;
  posicao?: LatLng;
  indiceElemento?: number;
  nomeElemento?: string;
  nomePropriedade?: string;
  valorPropriedade?: string;
  valorBooleano?: boolean;
};
