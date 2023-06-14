import { elementos } from "@/main/constants/elementos";

const changeElementos = (oldMapaContext, nome, posicao) => {
  return {
    ...oldMapaContext,
    elemento: { ...oldMapaContext.elemento, nome: nome, posicao: posicao },
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
    },
  };
};

const MapaFunctionHelpers = {
  changeElementos,
  addElementoMarker,
  addElementoFromMarkers,
};
export default MapaFunctionHelpers;
