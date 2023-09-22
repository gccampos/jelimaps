import { actionContextChange, mapaContextSchema } from "./mapaContextTypes";
import MapaFunctionHelpers from "./MapaFunctionsHelpers";

export function mapaReducer(
  oldMapaContext: mapaContextSchema,
  action: actionContextChange
): mapaContextSchema {
  switch (action.type) {
    case "modoVisao": {
      return { ...oldMapaContext, modoVisao: action.tipo };
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
    case "desativarElementos": {
      return MapaFunctionHelpers.changeElementoInteracao(oldMapaContext, null);
    }
    case "addMarker": {
      return MapaFunctionHelpers.addElementoMarker(oldMapaContext, action);
    }
    case "addPolyline": {
      return MapaFunctionHelpers.addElementoPolyline(oldMapaContext, action);
    }
    case "addPolygon": {
      return MapaFunctionHelpers.addElementoPolygon(oldMapaContext, action);
    }
    case "addCircle": {
      return MapaFunctionHelpers.addElementoCirculo(oldMapaContext, action);
    }
    // case "addRectangle": {
    //   return MapaFunctionHelpers.addElementoQuadrilatero(
    //     oldMapaContext,
    //     action
    //   );
    // }
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
        action.nomeElemento,
        action.nomePropriedade,
        action.valorPropriedade
      );
    }
    case "trocaMapaContext": {
      return {
        ...(action.mapContext ?? oldMapaContext),
      };
    }
    case "atualizaTempo": {
      return { ...oldMapaContext, tempo: action.time ?? oldMapaContext.tempo };
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
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
