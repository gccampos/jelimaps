import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useMapaContext } from "../../Mapa/context/MapaContext";
import { elementoPadrao } from "../../Mapa/context/mapaContextTypes";
import VisTimeline from "./VisTimeline";

export default function LinhaTempo() {
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
  return (
    <Grid
      id={"oi"}
      item
      xs={12}
      sx={{
        height: "100%",
        ".personalized-scrollbar": {
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: 7,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            outline: `1px solid slategrey`,
          },
        },
      }}
    >
      {/* <LinhaTempoArtesanal
        cliqueElementoConteudoLinhaTempo={cliqueElementoConteudoLinhaTempo}
        listaElementos={listaElementos}
        setListaElementos={setListaElementos}
      /> */}
      <VisTimeline listaElementos={listaElementos} />
    </Grid>
  );
}
