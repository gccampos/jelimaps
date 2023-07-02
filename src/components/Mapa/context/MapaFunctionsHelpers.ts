import { elementos } from "@/main/constants/elementos";
import { mapaContextSchema } from "./MapaContext";

const changeElementos = (
  oldMapaContext: mapaContextSchema,
  elemento,
  posicao
): mapaContextSchema => {
  return {
    ...oldMapaContext,
    elementoAdd: {
      ...oldMapaContext.elementoAdd,
      ...elemento,
      posicao: posicao,
    },
  };
};

const addElementoMarker = (oldMapaContext, position, dataRef) => {
  const newMarker = {
    position,
    dataRef,
    nome: `marker#${oldMapaContext.conteudo?.Marker?.length + 1 || 1}`,
  };
  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      Marker: oldMapaContext.conteudo?.Marker
        ? [...oldMapaContext.conteudo.Marker, newMarker]
        : [newMarker],
    },
  };
};

const addElementoCirculo = (oldMapaContext, position, dataRef) => {
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
      Circle: oldMapaContext.conteudo?.Circle
        ? [...oldMapaContext.conteudo.Circle, newCircle]
        : [newCircle],
    },
  };
};

const retornarMarkersPuros = (oldMapaContext) => {
  return oldMapaContext.conteudo?.Marker &&
    oldMapaContext.conteudo?.Marker.length
    ? [
        ...oldMapaContext.conteudo.Marker.filter(
          (x) => x.dataRef === elementos.Marker.nome
        ),
      ]
    : [];
};

const removerMarkersReferenciados = (oldMapaContext, ref) => {
  return oldMapaContext.conteudo?.Marker &&
    oldMapaContext.conteudo?.Marker.length
    ? [...oldMapaContext.conteudo.Marker.filter((x) => x.dataRef !== ref)]
    : [];
};

const retornarElementoPositionsFromMarkersDataRef = (
  oldMapaContext,
  nomeElemento
) => {
  const arrayElemento = oldMapaContext.conteudo[nomeElemento];
  return {
    positions: oldMapaContext.conteudo.Marker.filter(
      (x) => x.dataRef === nomeElemento
    ).map((x) => x.position),
    dataRef: nomeElemento,
    nome: `${nomeElemento}#${arrayElemento?.length + 1 || 1}`,
  };
};

const retornarBoundsPositionsFromTwoMarkersDataRef = (
  oldMapaContext,
  nomeElemento
) => {
  const markers = oldMapaContext.conteudo.Marker.filter(
    (x) => x.dataRef === elementos.Rectangle.nome
  );
  const arrayElemento = oldMapaContext.conteudo[nomeElemento];
  return {
    bounds: markers.splice(0, 2).map((x) => x.position),
    nome: `${nomeElemento}#${arrayElemento?.length + 1 || 1}`,
    dataRef: nomeElemento,
  };
};

const retornarElementosPositionsWithNewElemento = (
  oldMapaContext,
  nomeElemento,
  tipoElemento,
  newElemento
) => {
  return nomeElemento === elementos[tipoElemento].nome
    ? oldMapaContext.conteudo[tipoElemento]
      ? [...oldMapaContext.conteudo[tipoElemento], newElemento]
      : [newElemento]
    : oldMapaContext.conteudo[tipoElemento];
};

const addElementoQuadrilatero = (oldMapaContext, nomeElemento) => {
  const newRectangle = retornarBoundsPositionsFromTwoMarkersDataRef(
    oldMapaContext,
    nomeElemento
  );
  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      Marker: removerMarkersReferenciados(oldMapaContext, nomeElemento),
      Rectangle: oldMapaContext.conteudo?.Rectangle
        ? [...oldMapaContext.conteudo.Rectangle, newRectangle]
        : [newRectangle],
    },
  };
};

const addElementoFromMarkers = (oldMapaContext, nomeElemento) => {
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
  oldMapaContext,
  tipoElemento,
  indiceElemento,
  nomeElemento
) => {
  const arrayElemento = oldMapaContext.conteudo[tipoElemento];
  if (arrayElemento[indiceElemento]?.nome === nomeElemento)
    arrayElemento.splice(indiceElemento, 1);
  return {
    ...oldMapaContext,
  };
};

const MapaFunctionHelpers = {
  changeElementos,
  addElementoMarker,
  addElementoFromMarkers,
  addElementoCirculo,
  addElementoQuadrilatero,
  removeElemento,
};
export default MapaFunctionHelpers;
