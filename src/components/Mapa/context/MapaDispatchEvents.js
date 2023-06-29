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
      console.log("chegou add circle")
      return MapaFunctionHelpers.addElementoCirculo(
        oldMapaContext,
        action.posicao,
        action.elemento
      );
    }
    case "addRectangle": {
      return MapaFunctionHelpers.addElementoFromMarkers(
        oldMapaContext,
        action.elemento
      );
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
