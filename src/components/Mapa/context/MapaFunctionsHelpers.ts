import { elementoProto, elementos } from "@/main/constants/elementos";
import {
  actionContextChange,
  elementoPadrao,
  mapaContextSchema,
  alteracaoElemento,
  tipoElemento,
  arrayRectangleType,
} from "./mapaContextTypes";
import { v4, NIL } from "uuid";
import moment from "moment";

const retornaListaElementosConteudoCenaAtual = (
  oldMapaContext: mapaContextSchema
) =>
  Object.keys(oldMapaContext?.conteudo)
    .map((x) => oldMapaContext?.conteudo[x])
    .flat()
    .filter(
      (x) =>
        moment(x.cenaInicio) <= moment(oldMapaContext.tempo) &&
        moment(x.cenaFim) >= moment(oldMapaContext.tempo)
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

const padraoElementoNovoAdicionado = (oldMapaContext: mapaContextSchema) => {
  return {
    cenaInicio: moment(oldMapaContext.conteudo.cenas[0].cenaInicio)
      .add(1, "seconds")
      .format("yyyy-MM-DDTHH:mm:ss"),
    cenaFim: moment(
      oldMapaContext.conteudo.cenas[oldMapaContext.conteudo.cenas.length - 1]
        .cenaFim
    )
      .add(-1, "seconds")
      .format("yyyy-MM-DDTHH:mm:ss"),
    order:
      retornaListaElementosConteudo(oldMapaContext).filter(
        (x) => !(x.visTimelineObject?.type === "background")
      ).length ?? 0,
    draggable: true,
  };
};

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

const changeElementoInteracao = (
  oldMapaContext: mapaContextSchema,
  elemento: elementoProto
): mapaContextSchema => {
  return {
    ...oldMapaContext,
    elementoInteracao: {
      ...elemento,
    },
  };
};

const changeElementoFoco = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const newElemntoFoco =
    actionContextChange.elemento ??
    (actionContextChange.id
      ? retornaListaElementosConteudo(oldMapaContext).find(
          (x) => x.id === actionContextChange.id
        )
      : null);
  return {
    ...oldMapaContext,
    elementosFoco: null,
    elementoFoco: newElemntoFoco,
  };
};

const changeElementosFoco = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const elementoNaoSelecionado = !oldMapaContext.elementosFoco?.some(
    (x) => x.id === actionContextChange.elemento.id
  );
  const newElementsFoco = oldMapaContext.elementosFoco
    ? elementoNaoSelecionado
      ? // Caso elemento clicado não esteja focado deve adiciona-lo
        [...oldMapaContext.elementosFoco, actionContextChange.elemento]
      : // Caso elemento clicado esteja focado deve remove-lo
        oldMapaContext.elementosFoco.filter(
          (x) => x.id !== actionContextChange.elemento.id
        )
    : // Caso exista apenas um elemento focado, adiciona na lista os dois (antigo e novo)
      [oldMapaContext.elementoFoco, actionContextChange.elemento];
  return {
    ...oldMapaContext,
    elementoFoco: actionContextChange.elemento,
    elementosFoco: newElementsFoco,
  };
};

const changeTodosElementosFocoPorIds = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
) => {
  return changeTodosElementosFoco(oldMapaContext, {
    ...actionContextChange,
    elementos: actionContextChange.ids.map((x) => {
      return { id: x } as tipoElemento;
    }),
  });
};

const changeTodosElementosFoco = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  return {
    ...oldMapaContext,
    elementoFoco: null,
    elementosFoco: actionContextChange.elementos,
  };
};

const addElementoPadrao = (
  oldMapaContext: mapaContextSchema,
  actionContext: actionContextChange
): mapaContextSchema => {
  if (
    actionContext.id &&
    oldMapaContext.conteudo[actionContext.tipo]?.some(
      (x) => x.id === actionContext.id
    )
  )
    return {
      ...oldMapaContext,
    };
  console.log("vai tentar inserir o elemento", actionContext);
  const newMarker: elementoPadrao = {
    geometry: actionContext.valor?.geometry ?? {
      coordinates: actionContext.posicao,
      type: actionContext.tipo,
    },
    dataRef: actionContext.tipo,
    nome: `${actionContext.tipo}#${
      oldMapaContext.conteudo?.Marker?.length + 1 || 1
    }`,
    texto: "",
    properties: actionContext.valor?.properties,
    id: actionContext.id ?? v4(),
    type: "Feature",
    ...padraoElementoNovoAdicionado(oldMapaContext),
  };
  //oldMapaContext.conteudo[actionContext.tipo]
  const newArrayConteudoTipo = oldMapaContext.conteudo[actionContext.tipo]
    ? [...oldMapaContext.conteudo[actionContext.tipo], newMarker]
    : [newMarker];
  return {
    ...oldMapaContext,
    elementoFoco: newMarker, //null,
    conteudo: {
      ...oldMapaContext.conteudo,
      [actionContext.tipo]: [...newArrayConteudoTipo],
    },
  };
};
const addElementoImagem = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const { tipo } = actionContextChange;
  const newImageOverlay = {
    bounds: oldMapaContext.bounds,
    positionTL: [
      oldMapaContext.bounds["_northEast"]["lat"],
      oldMapaContext.bounds["_southWest"]["lng"],
    ] as [number, number],
    positionBL: [
      oldMapaContext.bounds["_southWest"]["lat"],
      oldMapaContext.bounds["_southWest"]["lng"],
    ] as [number, number],
    positionTR: [
      oldMapaContext.bounds["_northEast"]["lat"],
      oldMapaContext.bounds["_northEast"]["lng"],
    ] as [number, number],
    dataRef: tipo,
    nome: `imagem#${oldMapaContext.conteudo?.ImageOverlay?.length + 1 || 1}`,
    urlImagem: actionContextChange.valor,
    id: actionContextChange.id ?? v4(),
    type: "Feature",
    ...padraoElementoNovoAdicionado(oldMapaContext),
  } as tipoElemento;
  console.log("imagem inserida", newImageOverlay);
  return {
    ...oldMapaContext,
    elementoFoco: newImageOverlay,
    conteudo: {
      ...oldMapaContext.conteudo,
      ImageOverlay: (oldMapaContext.conteudo?.ImageOverlay
        ? [...oldMapaContext.conteudo.ImageOverlay, newImageOverlay]
        : [newImageOverlay]) as arrayRectangleType,
    },
    elementoInteracao: elementos.Hand,
  };
};

const removeElemento = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const listaElementos = retornaListaElementosConteudo(oldMapaContext);
  console.log("vai remover algo");
  let newConteudo = { ...oldMapaContext.conteudo };
  const removerUmElemento = (elementos: any[], id: NIL) => {
    console.log("vai remover algo - removerUmElemento", id);
    const newElementos = [...elementos];
    newElementos.splice(
      elementos.findIndex((x) => x.id === id),
      1
    );
    return newElementos;
  };
  oldMapaContext.elementosFoco
    ? oldMapaContext.elementosFoco.forEach((element) => {
        if (listaElementos.some((x) => x.id === element.id))
          newConteudo[listaElementos.find((x) => x.id === element.id).dataRef] =
            removerUmElemento(
              oldMapaContext.conteudo[
                listaElementos.find((x) => x.id === element.id).dataRef
              ],
              element.id
            );
        else {
          const listaAlteracoesConteudo =
            retornaListaAlteracoesConteudo(oldMapaContext);
          if (listaAlteracoesConteudo.some((x) => x.id === element.id)) {
            const elementoPai = listaElementos.find((x) =>
              x.alteracoes?.some((x) => x.id === element.id)
            );
            newConteudo[elementoPai.dataRef].find(
              (x) => x.id === elementoPai.id
            ).alteracoes = removerUmElemento(
              oldMapaContext.conteudo[elementoPai.dataRef].find(
                (x) => x.id === elementoPai.id
              ).alteracoes,
              element.id
            );
          }
        }
      })
    : oldMapaContext.elementoFoco
    ? (newConteudo[oldMapaContext.elementoFoco.dataRef] = removerUmElemento(
        oldMapaContext.conteudo[oldMapaContext.elementoFoco.dataRef],
        oldMapaContext.elementoFoco.id
      ))
    : actionContextChange.id
    ? (newConteudo[
        listaElementos.find((x) => x.id === actionContextChange.id).dataRef
      ] = removerUmElemento(
        oldMapaContext.conteudo[
          listaElementos.find((x) => x.id === actionContextChange.id).dataRef
        ],
        actionContextChange.id
      ))
    : oldMapaContext;

  return {
    ...oldMapaContext,
    conteudo: newConteudo,
  };
};

const atualizaLinhaTempoElemento = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const listaElementos = retornaListaElementosConteudo(oldMapaContext);
  const elementoAlvo = listaElementos.find(
    (x) =>
      x.id === actionContextChange.id ||
      x.alteracoes?.some((z) => z.id === actionContextChange.id)
  );
  const cenaInicio = moment(actionContextChange.start).format(
    "yyyy-MM-DDTHH:mm:ss"
  );
  const cenaFim = moment(actionContextChange.end).format("yyyy-MM-DDTHH:mm:ss");
  if (elementoAlvo.id === actionContextChange.id) {
    elementoAlvo.cenaFim = cenaFim;
    elementoAlvo.cenaInicio = cenaInicio;
  } else {
    const alteracaoAlvo = elementoAlvo.alteracoes.find(
      (x) => x.id === actionContextChange.id
    );
    alteracaoAlvo.cenaFim = cenaFim;
    alteracaoAlvo.cenaInicio = cenaInicio;
  }
  return {
    ...oldMapaContext,
  };
};

const alteraCoordinatesElemento = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const conteudo = retornaListaElementosConteudo(oldMapaContext);
  const newElement = conteudo.find((x) => x.id === actionContextChange.id);
  if (!newElement) return { ...oldMapaContext };
  // oldMapaContext.conteudo[ds.dataRef][
  //   oldMapaContext.conteudo[ds.dataRef].findIndex((x) => x.id === ds.id)
  // ].geometry.coordinates = actionContextChange.posicao;
  const newListaConteudoTipo = oldMapaContext.conteudo[newElement.dataRef].map(
    (elemento) =>
      elemento.id === actionContextChange.id
        ? {
            ...elemento,
            geometry: {
              ...elemento.geometry,
              coordinates: actionContextChange.posicao,
            },
          }
        : elemento
  );
  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      [newElement.dataRef]: [...newListaConteudoTipo],
    },
  };
};

const editarPropriedadeElemento = (
  oldMapaContext: mapaContextSchema,
  tipoElemento: string,
  id: NIL,
  nomePropriedade: string,
  novoValor: any
): mapaContextSchema => {
  console.log(
    `Alterando o ${nomePropriedade} de um ${tipoElemento}(${id}) para o valor: ${novoValor}`
  );
  const newListaConteudoTipo = oldMapaContext.conteudo[tipoElemento].map(
    (elemento) =>
      elemento.id === id
        ? { ...elemento, [nomePropriedade]: novoValor }
        : elemento
  );
  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      [tipoElemento]: [...newListaConteudoTipo],
    },
  };
};

const addAlteracaoElemento = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const elemento = retornaListaElementosConteudo(oldMapaContext).find(
    (x) => x.id === actionContextChange.group
  );

  if (
    elemento &&
    new Date(elemento.cenaInicio) < new Date(actionContextChange.start) &&
    new Date(elemento.cenaFim) > new Date(actionContextChange.start)
  ) {
    const conten = {
      id: v4(),
      cenaInicio: moment(actionContextChange.start).format(
        "yyyy-MM-DDTHH:mm:ss"
      ),
      cenaFim: actionContextChange.start,
      nome: `Alteração #${(elemento.alteracoes?.length ?? 0) + 1} do ${
        elemento.nome
      }`,
      valor: 0,
      tipo: "",
      visTimelineObject: { type: "box" },
    } as alteracaoElemento;
    if (
      oldMapaContext.conteudo[elemento.dataRef].find(
        (x) => x.id === elemento.id
      ).alteracoes
    )
      oldMapaContext.conteudo[elemento.dataRef]
        .find((x) => x.id === elemento.id)
        .alteracoes.push(conten);
    else
      oldMapaContext.conteudo[elemento.dataRef].find(
        (x) => x.id === elemento.id
      ).alteracoes = [conten];
  }
  return {
    ...oldMapaContext,
  };
};

const novaCena = (oldMapaContext: mapaContextSchema) => {
  const cenafim = moment(
    oldMapaContext.conteudo.cenas[oldMapaContext.conteudo.cenas.length - 1]
      .cenaFim
  );
  const cenainicio = moment(
    oldMapaContext.conteudo.cenas[oldMapaContext.conteudo.cenas.length - 1]
      .cenaInicio
  );
  const diffCen = cenafim.diff(cenainicio, "seconds");
  return {
    id: v4(),
    cenaInicio: cenafim.format("yyyy-MM-DDTHH:mm:ss"),
    cenaFim: cenafim.add(diffCen, "seconds").format("yyyy-MM-DDTHH:mm:ss"),
    nome: `cena #${oldMapaContext.conteudo.cenas.length}`,
    dataRef: "cenas",
    style: `background-color: ${getRandomColor()}`,
    visTimelineObject: { type: "background" },
  } as elementoPadrao;
};

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const movendoImagem = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const elemento = oldMapaContext.conteudo.ImageOverlay.find(
    (x) => x.id === actionContextChange.id
  );
  elemento.positionTL = actionContextChange.valor.positionTL;
  elemento.positionTR = actionContextChange.valor.positionTR;
  elemento.positionBL = actionContextChange.valor.positionBL;
  return {
    ...oldMapaContext,
  };
};

const MapaFunctionHelpers = {
  changeElementoInteracao,
  changeElementoFoco,
  changeElementosFoco,
  changeTodosElementosFoco,
  changeTodosElementosFocoPorIds,
  addElementoPadrao,
  addElementoImagem,
  alteraCoordinatesElemento,
  removeElemento,
  atualizaLinhaTempoElemento,
  editarPropriedadeElemento,
  addAlteracaoElemento,
  novaCena,
  retornaElementoOuAlteracaoPorId,
  movendoImagem,
  retornaListaElementosConteudo,
  retornaListaElementosConteudoCenaAtual,
};
export default MapaFunctionHelpers;
