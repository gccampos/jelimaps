import { elementoProto } from "@/main/constants/elementos";
import {
  CircleType,
  PolygonType,
  PolylineType,
  actionContextChange,
  elementoComPosition,
  elementoComPositions,
  mapaContextSchema,
  propriedadeVisual,
  tipoElemento,
} from "./mapaContextTypes";
import { v4, NIL } from "uuid";

const changeElementoInteracao = (
  oldMapaContext: mapaContextSchema,
  elemento: elementoProto
): mapaContextSchema => {
  return {
    ...oldMapaContext,
    elementoInteracao: {
      ...oldMapaContext.elementoInteracao,
      ...elemento,
    },
  };
};

const changeElementoFoco = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  oldMapaContext.elementoFoco = actionContextChange.elemento;
  oldMapaContext.elementosFoco = null;
  return { ...oldMapaContext };
};

const changeElementosFoco = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const elementoNaoSelecionado = !oldMapaContext.elementosFoco?.some(
    (x) => x.id === actionContextChange.elemento.id
  );
  oldMapaContext.elementosFoco = oldMapaContext.elementosFoco
    ? elementoNaoSelecionado
      ? // Caso elemento clicado não esteja focado deve adiciona-lo
        [...oldMapaContext.elementosFoco, actionContextChange.elemento]
      : // Caso elemento clicado esteja focado deve remove-lo
        oldMapaContext.elementosFoco.filter(
          (x) => x.id !== actionContextChange.elemento.id
        )
    : // Caso exista apenas um elemento focado, adiciona na lista os dois (antigo e novo)
      [oldMapaContext.elementoFoco, actionContextChange.elemento];
  oldMapaContext.elementoFoco = actionContextChange.elemento;
  return { ...oldMapaContext };
};

const changeTodosElementosFocoPorIds = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
) => {
  const todoConteudo = Object.keys(oldMapaContext?.conteudo)
    .map((x) => oldMapaContext?.conteudo[x])
    .flat();
  const listaNovaElementos = todoConteudo.filter((x) =>
    actionContextChange.ids.some((z) => z === x.id)
  );
  oldMapaContext.elementoFoco = null;
  return changeTodosElementosFoco(oldMapaContext, {
    ...actionContextChange,
    elementos: listaNovaElementos,
  });
};

const changeTodosElementosFoco = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  oldMapaContext.elementosFoco = actionContextChange.elementos;
  //oldMapaContext.elementoFoco = null;
  return { ...oldMapaContext };
};

const padraoPeriodoMapaContext = (oldMapaContext: mapaContextSchema) => {
  return {
    cenaInicio: oldMapaContext.cenaInicio,
    cenaFim: oldMapaContext.cenaFim,
  };
};

const addElementoMarker = (
  oldMapaContext: mapaContextSchema,
  actionContext: actionContextChange
): mapaContextSchema => {
  const newMarker: elementoComPosition = {
    position: actionContext.posicao,
    dataRef: actionContext.tipo,
    nome: `marker#${oldMapaContext.conteudo?.Marker?.length + 1 || 1}`,
    texto: "",
    id: v4(),
    ...padraoPeriodoMapaContext(oldMapaContext),
  };

  oldMapaContext = changeElementoFoco(oldMapaContext, {
    ...actionContext,
    elemento: newMarker,
  });
  oldMapaContext.conteudo.Marker = oldMapaContext.conteudo?.Marker
    ? [...oldMapaContext.conteudo.Marker, newMarker]
    : [newMarker];
  return {
    ...oldMapaContext,
  };
};

const addElementoPolyline = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  if (!(oldMapaContext.elementoFoco?.dataRef === actionContextChange.tipo)) {
    const newPolyline: elementoComPositions = {
      positions: [actionContextChange.posicao],
      dataRef: actionContextChange.tipo,
      id: v4(),
      nome: `polyline#${oldMapaContext.conteudo?.Polyline?.length + 1 || 1}`,
      ...padraoPeriodoMapaContext(oldMapaContext),
    };
    oldMapaContext = changeElementoFoco(oldMapaContext, {
      ...actionContextChange,
      elemento: newPolyline,
    });
    return {
      ...oldMapaContext,
      conteudo: {
        ...oldMapaContext.conteudo,
        Polyline: (oldMapaContext.conteudo?.Polyline
          ? [...oldMapaContext.conteudo.Polyline, newPolyline]
          : [newPolyline]) as PolylineType,
      },
    };
  } else {
    (oldMapaContext.elementoFoco as elementoComPositions).positions = [
      ...(oldMapaContext.elementoFoco as elementoComPositions).positions,
      actionContextChange.posicao,
    ];
    return {
      ...oldMapaContext,
    };
  }
};

const addElementoPolygon = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  if (!(oldMapaContext.elementoFoco?.dataRef === actionContextChange.tipo)) {
    const newPolygon: elementoComPositions = {
      positions: [actionContextChange.posicao],
      dataRef: actionContextChange.tipo,
      id: v4(),
      nome: `polygon#${oldMapaContext.conteudo?.Polygon?.length + 1 || 1}`,
      ...padraoPeriodoMapaContext(oldMapaContext),
    };
    oldMapaContext = changeElementoFoco(oldMapaContext, {
      ...actionContextChange,
      elemento: newPolygon,
    });
    return {
      ...oldMapaContext,
      conteudo: {
        ...oldMapaContext.conteudo,
        Polygon: (oldMapaContext.conteudo?.Polygon
          ? [...oldMapaContext.conteudo.Polygon, newPolygon]
          : [newPolygon]) as PolygonType,
      },
    };
  } else {
    (oldMapaContext.elementoFoco as elementoComPositions).positions = [
      ...(oldMapaContext.elementoFoco as elementoComPositions).positions,
      actionContextChange.posicao,
    ];
    return {
      ...oldMapaContext,
    };
  }
};

const addElementoCirculo = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const { tipo, posicao } = actionContextChange;
  const newCircle = {
    center: posicao,
    radius: 100,
    dataRef: tipo,
    id: v4(),
    nome: `circle#${oldMapaContext.conteudo?.Circle?.length + 1 || 1}`,
    ...padraoPeriodoMapaContext(oldMapaContext),
  };
  oldMapaContext = changeElementoFoco(oldMapaContext, {
    ...actionContextChange,
    elemento: newCircle,
  });
  return {
    ...oldMapaContext,
    conteudo: {
      ...oldMapaContext.conteudo,
      Circle: (oldMapaContext.conteudo?.Circle
        ? [...oldMapaContext.conteudo.Circle, newCircle]
        : [newCircle]) as CircleType,
    },
  };
};

// const addElementoQuadrilatero = (
//   oldMapaContext: mapaContextSchema,
//   actionContextChange: actionContextChange
// ): mapaContextSchema => {
//   const { nomeElemento } = actionContextChange;
//   const newRectangle: elementoComBounds = {bounds:LatLngBounds()} as elementoComBounds;
//   return {
//     ...oldMapaContext,
//     conteudo: {
//       ...oldMapaContext.conteudo,
//       Rectangle: (oldMapaContext.conteudo?.Rectangle
//         ? [...oldMapaContext.conteudo.Rectangle, newRectangle]
//         : [newRectangle]) as RectangleType,
//     },
//   };
// };

const removeElemento = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const removerUmElemento = (elementos: tipoElemento[], id: NIL) => {
    elementos.splice(
      elementos.findIndex((x) => x.id === id),
      1
    );
  };
  oldMapaContext.elementosFoco
    ? oldMapaContext.elementosFoco.forEach((element) => {
        removerUmElemento(oldMapaContext.conteudo[element.dataRef], element.id);
      })
    : oldMapaContext.elementoFoco
    ? removerUmElemento(
        oldMapaContext.conteudo[oldMapaContext.elementoFoco.dataRef],
        oldMapaContext.elementoFoco.id
      )
    : actionContextChange.id
    ? removerUmElemento(
        oldMapaContext.conteudo[
          Object.keys(oldMapaContext?.conteudo)
            .map((x) => oldMapaContext?.conteudo[x])
            .flat()
            .find((x) => x.id === actionContextChange.id).dataRef
        ],
        actionContextChange.id
      )
    : oldMapaContext;

  return {
    ...oldMapaContext,
  };
};

const atualizaLinhaTempoElemento = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const elementoAlvo = Object.keys(oldMapaContext?.conteudo)
    .map((x) => oldMapaContext?.conteudo[x])
    .flat()
    .find((x) => x.id === actionContextChange.id);
  elementoAlvo.cenaFim = actionContextChange.end;
  elementoAlvo.cenaInicio = actionContextChange.start;
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

const addAlteracaoElemento = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  console.log("funcciotn ||| addAlteracaoElemento", actionContextChange);
  const elemento = Object.keys(oldMapaContext.conteudo)
    .map((x) => oldMapaContext.conteudo[x])
    .flat()
    .find((x) => x.id === actionContextChange.group);
  if (
    elemento &&
    new Date(elemento.cenaInicio) < new Date(actionContextChange.start) &&
    new Date(elemento.cenaFim) > new Date(actionContextChange.start)
  ) {
    const conten = {
      id: actionContextChange.id ?? v4(),
      cenaInicio: actionContextChange.start,
      cenaFim: actionContextChange.start,
      nome: `Propriedade #${(elemento.alteracoes?.length ?? 0) + 1} do ${
        elemento.nome
      }`,
      valor: 0,
      form: null,
      tipo: "",
      type: "box",
    } as propriedadeVisual;
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

const MapaFunctionHelpers = {
  changeElementoInteracao,
  changeElementoFoco,
  changeElementosFoco,
  changeTodosElementosFoco,
  changeTodosElementosFocoPorIds,
  addElementoMarker,
  addElementoCirculo,
  addElementoPolyline,
  addElementoPolygon,
  //addElementoQuadrilatero,
  removeElemento,
  atualizaLinhaTempoElemento,
  editarPropriedadeElemento,
  addAlteracaoElemento,
};
export default MapaFunctionHelpers;
