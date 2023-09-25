import { elementos } from "@/main/constants/elementos";
import { useMapaContext, useMapaDispatch } from "./context/MapaContext";
import { useMapEvents } from "react-leaflet";
import { LeafletEventHandlerFnMap } from "leaflet";

function isControlLeafLet(node) {
  const resutl =
    node.tagName === "path" ||
    node.tagName === "svg" ||
    typeof node.className === "object"
      ? isControlLeafLet(node.parentElement)
      : node.className.includes("leaflet-control")
      ? node.className.includes("leaflet-control")
      : isLeafletContainer(node)
      ? !node.className.includes("leaflet-container")
      : node.parentElement
      ? isControlLeafLet(node.parentElement)
      : false;
  return resutl;
}

function isLeafletContainer(node) {
  return (
    node.tagName === "DIV" && node.className?.includes("leaflet-container")
  );
}

function AddElementoInteracao() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  function interagirMapa(nomeElemento: string): LeafletEventHandlerFnMap {
    if (nomeElemento === elementos.Hand.nome)
      return {
        click(e) {
          if (isLeafletContainer(e.originalEvent.target))
            dispatch({
              type: `selecionarElementoFoco`,
            });
        },
      };
    return {
      click(e) {
        if (!isControlLeafLet(e.originalEvent.target))
          dispatch({
            type: `add${nomeElemento}`,
            tipo: nomeElemento,
            posicao: e.latlng,
          });
      },
    };
  }

  useMapEvents(
    mapaContext?.elementoInteracao && mapaContext?.elementoInteracao.nome
      ? interagirMapa(mapaContext.elementoInteracao.nome)
      : {}
  );

  return null;
}

export default AddElementoInteracao;
