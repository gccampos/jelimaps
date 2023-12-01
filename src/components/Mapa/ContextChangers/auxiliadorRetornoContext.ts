import { mapaContextSchema, tipoElemento } from "../mapaContextTypes";
import { NIL } from "uuid";
import moment from "moment";
import { DateType } from "vis-timeline/standalone";

const retornaListaElementosConteudoCenaAtual = (
  oldMapaContext: mapaContextSchema
) =>
  oldMapaContext?.conteudo &&
  Object.keys(oldMapaContext?.conteudo)
    .map((x) => oldMapaContext?.conteudo[x])
    .flat()
    .filter(
      (x) =>
        moment(x.cenaInicio) <= moment(oldMapaContext.tempo) &&
        moment(x.cenaFim) >= moment(oldMapaContext.tempo)
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

const auxiliadorRetornoContext = {
  isElementoSelecionado,
  retornaListaTemposConteudo,
  retornaListaElementosConteudo,
  retornaListaAlteracoesConteudo,
  retornaElementoOuAlteracaoPorId,
  retornaListaElementosConteudoCenaAtual,
};
export default auxiliadorRetornoContext;
