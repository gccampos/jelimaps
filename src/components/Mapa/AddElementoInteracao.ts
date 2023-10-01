import { elementos } from "@/main/constants/elementos";
import { useMapaContext, useMapaDispatch } from "./context/MapaContext";
import { useMapEvents } from "react-leaflet";
import { LeafletEventHandlerFnMap } from "leaflet";

function isControlLeafLetContainer(node) {
  const resutl =
    ((!!node.classList &&
      Array.from(node.classList).some((x) => x === "leaflet-container")) ||
      Array.from(node.classList).some((x) => x === "background-scene")) ??
    false;
  return resutl;
}

function AddElementoInteracao() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  function interagirMapa(nomeElemento: string): LeafletEventHandlerFnMap {
    return {
      click(e) {
        if (isControlLeafLetContainer(e.originalEvent.target))
          dispatch({
            type: `add${nomeElemento}`,
            tipo: nomeElemento,
            posicao: e.latlng,
          });
      },
    };
  }

  useMapEvents(
    mapaContext?.elementoInteracao &&
      mapaContext?.elementoInteracao.nome &&
      mapaContext?.elementoInteracao.nome !== elementos.Hand.nome
      ? interagirMapa(mapaContext.elementoInteracao.nome)
      : {
          click(e) {
            console.log("AddElementoInteracao", e);
            if (
              (mapaContext.elementoFoco !== null ||
                mapaContext.elementosFoco !== null) &&
              isControlLeafLetContainer(e.originalEvent.target) &&
              !(e.originalEvent.target as any).className.includes("sjx-hdl")
            )
              dispatch({
                type: `selecionarElementoFoco`,
              });
          },
        }
  );

  return null;
}

export default AddElementoInteracao;
