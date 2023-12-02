import { mapaContextSchema, tipoElemento } from "../mapaContextTypes";
import { NIL } from "uuid";
import moment from "moment";
import { DateType } from "vis-timeline/standalone";

const retornaListaElementosConteudoCenaAtual = (
  oldMapaContext: mapaContextSchema,
  time?: DateType
) =>
  oldMapaContext?.conteudo &&
  Object.keys(oldMapaContext?.conteudo)
    .map((x) => oldMapaContext?.conteudo[x])
    .flat()
    .filter(
      (x) =>
        moment(x.cenaInicio) <= moment(time ?? oldMapaContext.tempo) &&
        moment(x.cenaFim) > moment(time ?? oldMapaContext.tempo)
    );

function removeDuplicates(array: DateType[]): DateType[] {
  return [...new Set(array)];
}
const retornaListaTemposConteudo = (oldMapaContext: mapaContextSchema) =>
  removeDuplicates(
    Object.keys(oldMapaContext?.conteudo)
      .map((x) => oldMapaContext?.conteudo[x])
      .flat()
      .map((x) => [x.cenaInicio, x.cenaFim])
      .flat()
  );

const retornaListaElementosConteudo = (oldMapaContext: mapaContextSchema) =>
  Object.keys(oldMapaContext?.conteudo)
    .map((x) => oldMapaContext?.conteudo[x])
    .flat();

const retornaListaAlteracoesConteudo = (oldMapaContext: mapaContextSchema) =>
  Object.keys(oldMapaContext?.conteudo)
    .map((x) => oldMapaContext?.conteudo[x])
    .flat()
    .map((x) => {
      return (x as tipoElemento).alteracoes;
    })
    .flat()
    .filter((x) => x);

const retornaElementoOuAlteracaoPorId = (
  oldMapaContext: mapaContextSchema,
  id: NIL
) => {
  const elemento = retornaListaElementosConteudo(oldMapaContext);
  return (
    elemento.find((x) => x.id === id) ??
    elemento
      .map((x) => {
        return (
          (x as tipoElemento).alteracoes &&
          (x as tipoElemento).alteracoes.map((z) => {
            return z ? { ...z } : null;
          })
        );
      })
      .flat()
      .filter((x) => x)
      .find((x) => x.id === id)
  );
};

const isElementoSelecionado = (oldMapaContext: mapaContextSchema, id: NIL) => {
  return (
    (oldMapaContext.elementosFoco &&
      oldMapaContext.elementosFoco.length > 0 &&
      oldMapaContext.elementosFoco?.some((x) => x.id === id)) ||
    oldMapaContext.elementoFoco?.id === id
  );
};

const bordasDoElemento = (
  x: tipoElemento,
  map: any,
  Leaflet: any,
  width?: number
) => {
  var elementoById = document.getElementById(x.id);
  var elementoVirtual = null;

  try {
    elementoVirtual = new Leaflet.GeoJSON(x);
  } catch (error) {
    /* empty */
  }

  return x.dataRef === "ImageOverlay"
    ? Leaflet.latLngBounds((x as any).positionBL, (x as any).positionTR)
    : elementoById && !elementoVirtual
    ? Leaflet.latLngBounds(
        map.containerPointToLatLng({
          x: elementoById.getBoundingClientRect().x - (width ? width - 24 : 60),
          y: elementoById.getBoundingClientRect().y + 6,
        }),
        map.containerPointToLatLng({
          x: elementoById.getBoundingClientRect().x - (width ?? 36),
          y: elementoById.getBoundingClientRect().y + 30,
        })
      )
    : elementoVirtual?.getBounds();
};

const elementoFoiClicado = (
  x: tipoElemento,
  e: any,
  map: any,
  Leaflet: any
) => {
  var bordasElementoClicado = bordasDoElemento(x, map, Leaflet);

  return bordasElementoClicado?.contains(e);
};

const auxiliadorRetornoContext = {
  bordasDoElemento,
  elementoFoiClicado,
  isElementoSelecionado,
  retornaListaTemposConteudo,
  retornaListaElementosConteudo,
  retornaListaAlteracoesConteudo,
  retornaElementoOuAlteracaoPorId,
  retornaListaElementosConteudoCenaAtual,
};
export default auxiliadorRetornoContext;
