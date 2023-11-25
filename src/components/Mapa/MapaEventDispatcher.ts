import moment from "moment";
import { actionContextChange, mapaContextSchema } from "./mapaContextTypes";
import MapaContextChanger from "./MapaContextChanger";

export function mapaReducer(
  oldMapaContext: mapaContextSchema,
  action: actionContextChange
): mapaContextSchema {
  console.log(
    `metodoDispatch [TYPE:${action.type}] disparado`,
    oldMapaContext,
    action
  );
  switch (action.type) {
    case "selecionarElementoInteracao": {
      return MapaContextChanger.changeElementoInteracao(
        oldMapaContext,
        action.arg
      );
    }
    case "adicionarElementoFoco": {
      return MapaContextChanger.changeElementosFoco(oldMapaContext, action);
    }
    case "adicionarAlteracaoElemento": {
      return MapaContextChanger.addAlteracaoElemento(oldMapaContext, action);
    }
    case "selecionarElementosFoco": {
      return MapaContextChanger.changeTodosElementosFoco(
        oldMapaContext,
        action
      );
    }
    case "selecionarElementoFoco": {
      return MapaContextChanger.changeElementoFoco(oldMapaContext, action);
    }
    case "selecionarElementosFocoPorId": {
      return MapaContextChanger.changeTodosElementosFocoPorIds(
        oldMapaContext,
        action
      );
    }
    case "addElemento": {
      return MapaContextChanger.addElementoPadrao(oldMapaContext, action);
    }
    case "alteraCoordinatesElemento": {
      return MapaContextChanger.alteraCoordinatesElemento(
        oldMapaContext,
        action
      );
    }
    case "adicionarImageOverlay": {
      return MapaContextChanger.addElementoImagem(oldMapaContext, action);
    }
    case "toggleCollapseTimeline": {
      action.tipo = oldMapaContext.elementoFoco.dataRef;
      action.id = oldMapaContext.elementoFoco.id;
      action.nomePropriedade = "collapseTimeline";
      action.valorPropriedade = !oldMapaContext.elementoFoco.collapseTimeline;

      return MapaContextChanger.editarPropriedadeElemento(
        oldMapaContext,
        action
      );
    }
    case "removeElements": {
      return MapaContextChanger.removeElemento(oldMapaContext, action);
    }
    case "updateTimelineElement": {
      return MapaContextChanger.atualizaLinhaTempoElemento(
        oldMapaContext,
        action
      );
    }
    case "editarPropriedade": {
      return MapaContextChanger.editarPropriedadeElemento(
        oldMapaContext,
        action
      );
    }
    case "movendoImagem": {
      return MapaContextChanger.movendoImagem(oldMapaContext, action);
    }

    // TODO: refatorar para ContextChangers (Elemento, Cena, LinhaTempo)
    case "propriedadeToggle": {
      return {
        ...oldMapaContext,
        slidePropriedade: !oldMapaContext.slidePropriedade,
      };
    }
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
    case "alteraTempoInicioFim": {
      return {
        ...oldMapaContext,
        cenaInicio: action.start,
        cenaFim: action.end,
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
      const novaCena = MapaContextChanger.novaCena(oldMapaContext);
      oldMapaContext.conteudo.cenas.push(novaCena);
      return {
        ...oldMapaContext,
        cenaFim: novaCena.cenaFim,
      };
    }
    case "deletarCena": {
      const novasCenas = oldMapaContext.conteudo.cenas.filter(
        (x) => x.id !== action.id
      );
      return {
        ...oldMapaContext,
        conteudo: { ...oldMapaContext.conteudo, cenas: novasCenas },
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
