import moment from "moment";
import { actionContextChange, mapaContextSchema } from "./mapaContextTypes";
import MapaFunctionHelpers from "./MapaFunctionsHelpers";

export function mapaReducer(
  oldMapaContext: mapaContextSchema,
  action: actionContextChange
): mapaContextSchema {
  switch (action.type) {
    case "modoVisao": {
      return {
        ...oldMapaContext,
        modoVisao: action.tipo,
        urlMapaProprio: action.valor ?? "",
      };
    }
    case "alteraPropriedadesMapa": {
      return {
        ...oldMapaContext,
        center: action.map?.getCenter(),
        zoom: action.map?.getZoom(),
        bounds: action.map?.getBounds(),
      };
    }
    case "selecionarElementoInteracao": {
      return MapaFunctionHelpers.changeElementoInteracao(
        oldMapaContext,
        action.arg
      );
    }
    case "adicionarElementoFoco": {
      return MapaFunctionHelpers.changeElementosFoco(oldMapaContext, action);
    }
    case "adicionarAlteracaoElemento": {
      return MapaFunctionHelpers.addAlteracaoElemento(oldMapaContext, action);
    }
    case "selecionarElementosFoco": {
      return MapaFunctionHelpers.changeTodosElementosFoco(
        oldMapaContext,
        action
      );
    }
    case "selecionarElementoFoco": {
      return MapaFunctionHelpers.changeElementoFoco(oldMapaContext, action);
    }
    case "selecionarElementosFocoPorId": {
      return MapaFunctionHelpers.changeTodosElementosFocoPorIds(
        oldMapaContext,
        action
      );
    }
    case "addElemento": {
      return MapaFunctionHelpers.addElementoPadrao(oldMapaContext, action);
    }
    case "alteraCoordinatesElemento": {
      return MapaFunctionHelpers.alteraCoordinatesElemento(
        oldMapaContext,
        action
      );
    }
    case "adicionarImageOverlay": {
      return MapaFunctionHelpers.addElementoImagem(oldMapaContext, action);
    }
    case "toggleCollapseTimeline": {
      return MapaFunctionHelpers.editarPropriedadeElemento(
        oldMapaContext,
        oldMapaContext.elementoFoco.dataRef,
        oldMapaContext.elementoFoco.id,
        "collapseTimeline",
        !oldMapaContext.elementoFoco.collapseTimeline
      );
    }
    case "propriedadeToggle": {
      return {
        ...oldMapaContext,
        slidePropriedade: !oldMapaContext.slidePropriedade,
      };
    }
    case "removeElements": {
      return MapaFunctionHelpers.removeElemento(oldMapaContext, action);
    }
    case "updateTimelineElement": {
      return MapaFunctionHelpers.atualizaLinhaTempoElemento(
        oldMapaContext,
        action
      );
    }
    case "editarPropriedade": {
      return MapaFunctionHelpers.editarPropriedadeElemento(
        oldMapaContext,
        action.tipo,
        action.id,
        action.nomePropriedade,
        action.valorPropriedade
      );
    }
    case "trocaMapaContext": {
      return {
        ...(action.mapContext ?? oldMapaContext),
      };
    }
    case "limpaCaixaDialogo": {
      return {
        ...oldMapaContext,
        caixaDialogo: "",
      };
    }
    case "movendoImagem": {
      return MapaFunctionHelpers.movendoImagem(oldMapaContext, action);
    }
    case "atualizaTempo": {
      const novoTempo = action.time ?? oldMapaContext.tempo;
      const cenaNova = oldMapaContext.conteudo.cenas.find(
        (x) =>
          moment(x.cenaInicio) <= moment(novoTempo) &&
          moment(x.cenaFim) >= moment(novoTempo) &&
          (moment(x.cenaInicio) > moment(oldMapaContext.tempo) ||
            moment(x.cenaFim) < moment(oldMapaContext.tempo))
      );
      if (cenaNova) {
        oldMapaContext.center = cenaNova.center;
        oldMapaContext.zoom = cenaNova.zoom;
        oldMapaContext.bounds = cenaNova.bounds;
      }
      return {
        ...oldMapaContext,
        tempo: moment(novoTempo).format("yyyy-MM-DDTHH:mm:ss"),
      };
    }
    case "alteraPropriedadeGeral": {
      if (action.tipo.includes("cena")) {
        if (!action.formik.isValid) return oldMapaContext;
        if (action.tipo === "cenaInicio")
          oldMapaContext.conteudo.cenas[0].cenaInicio = action.valor;
        if (action.tipo === "cenaFim")
          oldMapaContext.conteudo.cenas[
            oldMapaContext.conteudo.cenas.length - 1
          ].cenaFim = action.valor;
      }
      return { ...oldMapaContext, [action.tipo]: action.valor };
    }
    case "alteraPropriedadeTimelineOptions": {
      if (action.tipo === "showCurrentTime")
        if (action.valor) oldMapaContext.tempo = oldMapaContext.cenaInicio;
      return {
        ...oldMapaContext,
        timelineOptions: {
          ...oldMapaContext.timelineOptions,
          [action.tipo]: action.valor,
        },
      };
    }
    case "inserindoNovaCena": {
      const novaCena = MapaFunctionHelpers.novaCena(oldMapaContext);
      oldMapaContext.conteudo.cenas.push(novaCena);
      return {
        ...oldMapaContext,
        cenaFim: novaCena.cenaFim,
      };
    }
    case "alteraPropriedadeCena": {
      if (!action.formik.isValid) return oldMapaContext;
      if (action.tipo.includes("cena"))
        if (action.tipo === "cenaInicio") {
          oldMapaContext.conteudo.cenas[action.indiceElemento][action.tipo] =
            action.valor;
          if (action.indiceElemento > 0)
            oldMapaContext.conteudo.cenas[action.indiceElemento - 1].cenaFim =
              action.valor;
        } else if (action.tipo === "cenaFim") {
          oldMapaContext.conteudo.cenas[action.indiceElemento][action.tipo] =
            action.valor;
          if (action.indiceElemento < oldMapaContext.conteudo.cenas.length - 2)
            oldMapaContext.conteudo.cenas[
              action.indiceElemento + 1
            ].cenaInicio = action.valor;
        } else
          oldMapaContext.conteudo.cenas[action.indiceElemento][action.tipo] =
            action.valor;
      else
        oldMapaContext.conteudo.cenas[action.indiceElemento][action.tipo] =
          action.valor;
      return { ...oldMapaContext };
    }
    case "fixarCena": {
      const ctent = oldMapaContext.conteudo.cenas.find(
        (x) => x.id === action.id
      );
      ctent.center = oldMapaContext.center;
      ctent.zoom = oldMapaContext.zoom;
      ctent.bounds = oldMapaContext.bounds;
      return {
        ...oldMapaContext,
      };
    }
    case "addImageOverlay": {
      return {
        ...oldMapaContext,
        caixaDialogo: "imageOverlay",
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
