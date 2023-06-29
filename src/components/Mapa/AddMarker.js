import { elementos } from "@/main/constants/elementos";
import { useMapaContext, useMapaDispatch } from "./context/MapaContext";
import { Marker, Popup, useMapEvents } from "react-leaflet";

function isControlLeafLet(node) {
  return node.tagName === "path" || node.tagName === "svg"
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
                elemento: mapaContext.elementoAdd.nome,
                posicao: e.latlng,
              });
          },
        }
      : {}
  );

  return mapaContext?.elementoAdd?.posicao != null ? (
    <Marker position={mapaContext.elementoAdd.posicao}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}

export default AddMarker;
