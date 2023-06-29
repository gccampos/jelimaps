import { elementos } from "@/main/constants/elementos";

const changeElementos = (oldMapaContext, elemento, posicao) => {
  return {
    ...oldMapaContext,
    elementoAdd: { ...oldMapaContext.elemento, ...elemento, posicao: posicao },
  };
};

const addElementoMarker = (oldMapaContext, position, dataRef) => {
  const newMarker = { position, dataRef };
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
  const newCircle = { position };
  console.log("add elemento circ", position);
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

const retornarCirculosPuros = (oldMapaContext) => {
  return oldMapaContext.conteudo?.Circle &&
    oldMapaContext.conteudo?.Circle.length
    ? [
        ...oldMapaContext.conteudo.Circle.filter(
          (x) => x.dataRef === elementos.Circle.nome
        ),
      ]
    : [];
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

const retornarElementoPositionsFromMarkersDataRef = (oldMapaContext) => {
  return {
    positions: oldMapaContext.conteudo.Marker.filter(
      (x) => x.dataRef !== elementos.Marker.nome
    ).map((x) => x.position),
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

const addElementoFromMarkers = (oldMapaContext, nomeElemento) => {
  const newElemento =
    retornarElementoPositionsFromMarkersDataRef(oldMapaContext);
  console.log("novo elemento", newElemento);
  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      Marker: retornarMarkersPuros(oldMapaContext),
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
      Circle: retornarCirculosPuros(oldMapaContext),
    },
  };
};

const MapaFunctionHelpers = {
  changeElementos,
  addElementoMarker,
  addElementoFromMarkers,
  addElementoCirculo,
};
export default MapaFunctionHelpers;
