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
    case "selecionarElementosFoco": {
      return MapaFunctionHelpers.changeTodosElementosFoco(
        oldMapaContext,
        action
      );
    }
    case "selecionarElementoFoco": {
      return MapaFunctionHelpers.changeElementoFoco(oldMapaContext, action);
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
    case "removeElement": {
      return MapaFunctionHelpers.removeElemento(
        oldMapaContext,
        action.tipo,
        action.indiceElemento,
        action.nomeElemento
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
    case "collapse": {
      console.log("action", action);
      if (action.indiceElemento != null) {
        oldMapaContext.conteudo[action.tipo][action.indiceElemento].collapse =
          action.valorBooleano;
      } else
        oldMapaContext.conteudo[action.tipo].collapse =
          action.valorBooleano ??
          !oldMapaContext.conteudo[action.tipo].collapse;
      return {
        ...oldMapaContext,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
