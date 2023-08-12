import { elementos } from "@/main/constants/elementos";
import { useMapaContext, useMapaDispatch } from "./context/MapaContext";
import { useMapEvents } from "react-leaflet";
import { Dispatch } from "react";
import { actionContextChange } from "./context/mapaContextTypes";

function isControlLeafLet(node) {
  return node.tagName === "path" ||
    node.tagName === "svg" ||
    typeof node.className === "object"
    ? isControlLeafLet(node.parentElement)
    : node.className.includes("leaflet-control")
    ? node.className.includes("leaflet-control")
    : node.className.includes("leaflet-container")
    ? !node.className.includes("leaflet-container")
    : node.parentElement
    ? isControlLeafLet(node.parentElement)
    : false;
}

function interagirMapa(
  nomeElemento: string,
  dispatch: Dispatch<actionContextChange>
) {
  switch (nomeElemento) {
    case elementos.Marker.nome:
      return {
        click(e) {
          if (!isControlLeafLet(e.originalEvent.target))
            dispatch({
              type: "addMarker",
              tipo: nomeElemento,
              posicao: e.latlng,
            });
        },
      };

    default:
      break;
  }
}

function AddElementoInteracao() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  useMapEvents(
    mapaContext?.elementoInteracao &&
      mapaContext?.elementoInteracao.nome &&
      mapaContext?.elementoInteracao.nome !== elementos.Hand.nome
      ? interagirMapa(mapaContext.elementoInteracao.nome, dispatch)
      : {}
  );

  return null;
}

export default AddElementoInteracao;
