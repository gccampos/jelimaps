import { elementos } from "@/main/constants/elementos";
import MapaFunctionHelpers from "./MapaFunctionsHelpers";

export function mapaReducer(oldMapaContext, action) {
  switch (action.type) {
    case "modoVisao": {
      return { ...oldMapaContext, modoVisao: action.arg };
    }
    case "elementos": {
      return MapaFunctionHelpers.changeElementos(
        oldMapaContext,
        action.arg,
        action.posicao || oldMapaContext.elemento?.posicao
      );
    }
    case "desativarElementos": {
      return MapaFunctionHelpers.changeElementos(oldMapaContext, "", null);
    }
    case "addMarker": {
      return MapaFunctionHelpers.addElementoMarker(
        oldMapaContext,
        action.posicao,
        action.elemento
      );
    }
    case "addPolyline": {
      return MapaFunctionHelpers.addElementoFromMarkers(
        oldMapaContext,
        action.elemento
      );
    }
    case "addPolygon": {
      return MapaFunctionHelpers.addElementoFromMarkers(
        oldMapaContext,
        action.elemento
      );
    }
    case "addCircle": {
      return MapaFunctionHelpers.addElementoCirculo(
        oldMapaContext,
        action.posicao,
        action.elemento
      );
    }
    case "addRectangle": {
      return MapaFunctionHelpers.addElementoQuadrilatero(
        oldMapaContext,
        action.elemento
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
        action.elemento,
        action.indiceElemento
      );
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
