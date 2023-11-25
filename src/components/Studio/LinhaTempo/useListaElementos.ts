import { useMapaContext } from "@/components/Mapa/MapaContext";
import { elementoPadrao } from "@/components/Mapa/mapaContextTypes";
import { useEffect, useState } from "react";

const useListaElementos = () => {
  const mapaContext = useMapaContext();
  const [listaElementos, setListaElementos] = useState<elementoPadrao[]>(
    Object.keys(mapaContext?.conteudo)
      .map((x) => mapaContext?.conteudo[x])
      .flat()
  );

  useEffect(() => {
    setListaElementos((lista) => [
      ...lista.filter((x) =>
        mapaContext?.conteudo[x.dataRef].some((z) => z.id === x.id)
      ),
      ...Object.keys(mapaContext?.conteudo)
        .map((x) => mapaContext?.conteudo[x])
        .flat()
        .filter((x) => !lista.some((z) => z.id === x.id)),
    ]);
  }, [mapaContext, mapaContext.conteudo]);

  return listaElementos;
};

export default useListaElementos;
