import { actionContextChange, mapaContextSchema } from "./MapaContext";
import MapaFunctionHelpers from "./MapaFunctionsHelpers";

export function mapaReducer(
  oldMapaContext: mapaContextSchema,
  action: actionContextChange
): mapaContextSchema {
  switch (action.type) {
    case "modoVisao": {
      return { ...oldMapaContext, modoVisao: action.tipo };
    }
    case "elementos": {
      return MapaFunctionHelpers.changeElemento(oldMapaContext, action.arg);
    }
    case "desativarElementos": {
      return MapaFunctionHelpers.changeElemento(oldMapaContext, null);
    }
    case "addMarker": {
      return MapaFunctionHelpers.addElementoMarker(
        oldMapaContext,
        action.posicao,
        action.tipo
      );
    }
    case "addPolyline": {
      return MapaFunctionHelpers.addElementoFromMarkers(
        oldMapaContext,
        action.tipo
      );
    }
    case "addPolygon": {
      return MapaFunctionHelpers.addElementoFromMarkers(
        oldMapaContext,
        action.tipo
      );
    }
    case "addCircle": {
      return MapaFunctionHelpers.addElementoCirculo(
        oldMapaContext,
        action.posicao,
        action.tipo
      );
    }
    case "addRectangle": {
      return MapaFunctionHelpers.addElementoQuadrilatero(
        oldMapaContext,
        action.tipo
      );
    }
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
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
