import { elementoProto } from "@/main/constants/elementos";
import { LatLng, LatLngBoundsExpression, MapOptions } from "leaflet";
import { NIL } from "uuid";
import { DateType, TimelineOptions } from "vis-timeline";
import { FormikProps } from "formik";

export type tipoGenericoElementoTimeline = periodoInicioFim & {
  id: NIL;
  nome: string;
  dataRef?: string;
  group?: NIL;
  type?: string;
  style?: string;
  collapse?: boolean;
  draggable?: boolean;
  order?: any;
};
export type elementoPadrao = tipoGenericoElementoTimeline & {
  texto?: string;
  color?: string;
  alteracoes?: alteracaoElemento[];
};
type periodoInicioFim = {
  cenaFim: DateType;
  cenaInicio: DateType;
};
export type alteracaoElemento = tipoGenericoElementoTimeline & {
  nome: string;
  tipo: any;
  valor: any;
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
  elementosFoco?: { id: NIL }[];
  slidePropriedade: boolean;
  modoVisao?: string;
  conteudo: conteudoType & {
    Marker?: markerType;
    Polyline?: PolylineType;
    Polygon?: PolygonType;
    Circle?: CircleType;
    Rectangle?: RectangleType;
    cenas: elementoPadrao[];
  };
  fit?: boolean;
  tempo: DateType;
  mapOptions: MapOptions;
  timelineOptions: TimelineOptions;
  reloadTimelineOptions?: boolean;
  playStatus: number;
};
type conteudoType = {
  [key: string]: arrayElemento;
};

export type markerType = arrayElementoGenerico<elementoComPosition>;
export type PolylineType = arrayElementoGenerico<elementoComPositions>;
export type PolygonType = arrayElementoGenerico<elementoComPositions>;
export type CircleType = arrayElementoGenerico<elementoCircle>;
export type RectangleType = arrayElementoGenerico<elementoComBounds>;
type basePrototypeArray = { collapse?: boolean };
type arrayElementoGenerico<T> = basePrototypeArray & T[];
type arrayElemento = basePrototypeArray & tipoElemento[];
export type tipoElemento =
  | elementoPadrao
  | elementoComPosition
  | elementoComPositions
  | elementoComBounds;

export type actionContextChange = {
  type: string;
  id?: NIL;
  group?: NIL;
  ids?: NIL[];
  arg?: elementoProto;
  elemento?: tipoElemento;
  elementos?: tipoElemento[];
  tipo?: string;
  valor?: any;
  posicao?: LatLng;
  indiceElemento?: number;
  nomeElemento?: string;
  nomePropriedade?: string;
  valorPropriedade?: any;
  valorBooleano?: boolean;
  start?: DateType;
  end?: DateType;
  time?: DateType;
  formik?: FormikProps<any>;
  mapContext?: mapaContextSchema;
};
