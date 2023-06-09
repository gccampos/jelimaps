import { elementos } from "@/main/constants/elementos";
import { useMapaContext, useMapaDispatch } from "./context/MapaContext";
import { useMapEvents } from "react-leaflet";

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

function AddMarker() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  useMapEvents(
    mapaContext?.elementoAdd &&
      mapaContext?.elementoAdd.nome &&
      mapaContext?.elementoAdd.nome !== elementos.Hand.nome
      ? {
          click(e) {
            if (!isControlLeafLet(e.originalEvent.target))
              dispatch({
                type: "addMarker",
                tipo: mapaContext.elementoAdd.nome,
                posicao: e.latlng,
              });
          },
        }
      : {}
  );

  return null;
}

export default AddMarker;
