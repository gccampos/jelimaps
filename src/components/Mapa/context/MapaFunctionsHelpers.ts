import { elementoProto, elementos } from "@/main/constants/elementos";
import {
  CircleType,
  RectangleType,
  elementoComPosition,
  elementoComPositions,
  elementoPadrao,
  mapaContextSchema,
  markerType,
} from "./mapaContextTypes";
import { LatLng, LatLngBounds } from "leaflet";

const changeElemento = (
  oldMapaContext: mapaContextSchema,
  elemento: elementoProto
): mapaContextSchema => {
  return {
    ...oldMapaContext,
    elementoAdd: {
      ...oldMapaContext.elementoAdd,
      ...elemento,
    },
  };
};
const padraoPeriodoMapaContext = (oldMapaContext: mapaContextSchema) => {
  return {
    cenaInicio: oldMapaContext.cenaInicio,
    cenaFim: oldMapaContext.cenaFim,
  };
};

const addElementoMarker = (
  oldMapaContext: mapaContextSchema,
  position: LatLng,
  dataRef: string
): mapaContextSchema => {
  const newMarker: elementoComPosition = {
    position,
    dataRef,
    nome: `marker#${oldMapaContext.conteudo?.Marker?.length + 1 || 1}`,
    texto: "",
    ...padraoPeriodoMapaContext(oldMapaContext),
  };

  oldMapaContext.conteudo.Marker = oldMapaContext.conteudo?.Marker
    ? [...oldMapaContext.conteudo.Marker, newMarker]
    : [newMarker];
  return {
    ...oldMapaContext,
  };
};

const addElementoCirculo = (
  oldMapaContext: mapaContextSchema,
  position: LatLng,
  dataRef: string
): mapaContextSchema => {
  const newCircle = {
    center: position,
    radius: 100,
    dataRef,
    nome: `circle#${oldMapaContext.conteudo?.Circle?.length + 1 || 1}`,
  };
  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      Marker: retornarMarkersPuros(oldMapaContext),
      Circle: (oldMapaContext.conteudo?.Circle
        ? [...oldMapaContext.conteudo.Circle, newCircle]
        : [newCircle]) as CircleType,
    },
  };
};

const retornarMarkersPuros = (
  oldMapaContext: mapaContextSchema
): markerType => {
  return oldMapaContext.conteudo?.Marker &&
    oldMapaContext.conteudo?.Marker.length
    ? ([
        ...oldMapaContext.conteudo.Marker.filter(
          (x) => x.dataRef === elementos.Marker.nome
        ),
      ] as markerType)
    : ([] as markerType);
};

const removerMarkersReferenciados = (
  oldMapaContext: mapaContextSchema,
  ref: string
): markerType => {
  return oldMapaContext.conteudo?.Marker &&
    oldMapaContext.conteudo?.Marker.length
    ? ([
        ...oldMapaContext.conteudo.Marker.filter((x) => x.dataRef !== ref),
      ] as markerType)
    : ([] as markerType);
};

const retornarElementoPositionsFromMarkersDataRef = (
  oldMapaContext: mapaContextSchema,
  nomeElemento: string
): elementoComPositions => {
  const arrayElemento = oldMapaContext.conteudo[nomeElemento];
  return {
    positions: oldMapaContext.conteudo.Marker.filter(
      (x) => x.dataRef === nomeElemento
    ).map<LatLng>((x) => x.position),
    dataRef: nomeElemento,
    nome: `${nomeElemento}#${arrayElemento?.length + 1 || 1}`,
    ...padraoPeriodoMapaContext(oldMapaContext),
  };
};

const retornarBoundsPositionsFromTwoMarkersDataRef = (
  oldMapaContext: mapaContextSchema,
  nomeElemento: string
) => {
  const markers = oldMapaContext.conteudo.Marker.filter(
    (x) => x.dataRef === elementos.Rectangle.nome
  );
  const arrayElemento = oldMapaContext.conteudo[nomeElemento];
  const positions = markers.splice(0, 2).map((x) => x.position);
  const bounds = positions as unknown as LatLngBounds;
  return {
    bounds: bounds,
    nome: `${nomeElemento}#${arrayElemento?.length + 1 || 1}`,
    dataRef: nomeElemento,
  };
};

const retornarElementosPositionsWithNewElemento = (
  oldMapaContext: mapaContextSchema,
  nomeElemento: string,
  tipoElemento: string,
  newElemento: elementoPadrao
): elementoComPositions[] => {
  return (
    nomeElemento === elementos[tipoElemento].nome
      ? oldMapaContext.conteudo[tipoElemento]
        ? [...oldMapaContext.conteudo[tipoElemento], newElemento]
        : [newElemento]
      : oldMapaContext.conteudo[tipoElemento]
  ) as elementoComPositions[];
};

const addElementoQuadrilatero = (
  oldMapaContext: mapaContextSchema,
  nomeElemento: string
): mapaContextSchema => {
  const newRectangle = retornarBoundsPositionsFromTwoMarkersDataRef(
    oldMapaContext,
    nomeElemento
  );
  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      Marker: removerMarkersReferenciados(oldMapaContext, nomeElemento),
      Rectangle: (oldMapaContext.conteudo?.Rectangle
        ? [...oldMapaContext.conteudo.Rectangle, newRectangle]
        : [newRectangle]) as RectangleType,
    },
  };
};

const addElementoFromMarkers = (
  oldMapaContext: mapaContextSchema,
  nomeElemento: string
): mapaContextSchema => {
  const newElemento = retornarElementoPositionsFromMarkersDataRef(
    oldMapaContext,
    nomeElemento
  );

  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      Marker: removerMarkersReferenciados(oldMapaContext, nomeElemento),
      Polyline: retornarElementosPositionsWithNewElemento(
        oldMapaContext,
        nomeElemento,
        elementos.Polyline.nome,
        newElemento
      ),
      Polygon: retornarElementosPositionsWithNewElemento(
        oldMapaContext,
        nomeElemento,
        elementos.Polygon.nome,
        newElemento
      ),
    },
  };
};

const removeElemento = (
  oldMapaContext: mapaContextSchema,
  tipoElemento: string,
  indiceElemento: number,
  nomeElemento: string
): mapaContextSchema => {
  const arrayElemento = oldMapaContext.conteudo[tipoElemento];
  if (arrayElemento[indiceElemento]?.nome === nomeElemento)
    arrayElemento.splice(indiceElemento, 1);
  return {
    ...oldMapaContext,
  };
};

const editarPropriedadeElemento = (
  oldMapaContext: mapaContextSchema,
  tipoElemento: string,
  nomeElemento: string,
  nomePropriedade: string,
  novoValor: string
): mapaContextSchema => {
  oldMapaContext.conteudo[tipoElemento].find(
    (elemento) => elemento.nome === nomeElemento
  )[nomePropriedade] = novoValor;
  return {
    ...oldMapaContext,
  };
};

const MapaFunctionHelpers = {
  changeElemento,
  addElementoMarker,
  addElementoFromMarkers,
  addElementoCirculo,
  addElementoQuadrilatero,
  removeElemento,
  editarPropriedadeElemento,
};
export default MapaFunctionHelpers;
