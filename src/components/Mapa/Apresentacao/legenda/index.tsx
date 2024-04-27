import React, { useState } from "react";
import {
  Paper,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import Leaflet, { Map } from "leaflet";
import contextChangers from "@/components/Mapa/ContextChangers";
import { useMapaContext } from "@/components/Mapa/MapaContext";
import { tipoElemento } from "@/components/Mapa/mapaContextTypes";
import LegendaLateral from "./lateral";
import LegendaMobile from "./mobile";
import { isMobile } from "..";
import useWindowDimensions from "@/components/Studio/useWindowDimensions";

export const ConteudoLegenda = ({
  elementosVisiveis,
  larguraLegenda,
  map,
}: {
  elementosVisiveis: tipoElemento[];
  map: Map;
  larguraLegenda: number;
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        overflowWrap: "anywhere",
        overflowY: "scroll",
      }}
    >
      {elementosVisiveis &&
        elementosVisiveis.map((x) => {
          return (
            <Card sx={{}} key={x.id}>
              <CardActionArea
                onClick={() => {
                  if (!x.center) {
                    const bordas = contextChangers.bordasDoElemento(
                      x,
                      map,
                      Leaflet,
                      larguraLegenda
                    );
                    bordas && map.flyToBounds(bordas);
                  } else {
                    map.flyTo(x.center, x.zoom);
                  }
                }}
              >
                {x.imagemURL && (
                  <CardMedia
                    component="img"
                    image={x.imagemURL}
                    alt={`imagem do ${x.nome}`}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {x.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {x.texto}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
    </Paper>
  );
};

const Legenda = (props: {
  map: Map;
  larguraLegenda: number;
  setLarguraLegenda: React.Dispatch<React.SetStateAction<number>>;
  alturaLegenda: number;
  setAlturaLegenda: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {
    map,
    setLarguraLegenda,
    larguraLegenda,
    alturaLegenda,
    setAlturaLegenda,
  } = props;
  const mapaContext = useMapaContext();
  const { height, width } = useWindowDimensions();
  const [elementosVisiveis, setElementosVisiveis] = React.useState(
    contextChangers.retornaListaElementosConteudoCenaAtual(mapaContext)
  );
  const [cenaAtual, setCenaAtual] = useState(null);

  React.useEffect(() => {
    const el = document.getElementById("seletorResize");
    if (el) el.parentElement.id = "parentSeletorResize";
  }, []);

  const moverMapaParaCena = React.useCallback(
    (cena: tipoElemento) => {
      try {
        if (cena.center && map) {
          setCenaAtual((c) => {
            if (c?.center !== cena.center) {
              map.flyTo(cena.center, cena.zoom, {
                animate: true,
                duration: 1.5,
                easeLinearity: 1,
              });
            }
            return cena;
          });
        }
      } catch (error) {
        /* empty */
      }
    },
    [map]
  );

  React.useEffect(() => {
    const els = contextChangers.retornaListaElementosConteudoCenaAtual(
      mapaContext,
      mapaContext.tempo
    );
    if (!cenaAtual || cenaAtual.id !== els[0].id) moverMapaParaCena(els[0]);
    setElementosVisiveis(els);
  }, [cenaAtual, mapaContext, mapaContext.tempo, moverMapaParaCena]);

  return isMobile(height, width) ? (
    <LegendaMobile
      ConteudoLegenda={ConteudoLegenda}
      elementosVisiveis={elementosVisiveis}
      map={map}
      setAlturaLegenda={setAlturaLegenda}
      alturaLegenda={alturaLegenda}
    />
  ) : (
    <LegendaLateral
      ConteudoLegenda={ConteudoLegenda}
      elementosVisiveis={elementosVisiveis}
      map={map}
      setLarguraLegenda={setLarguraLegenda}
      larguraLegenda={larguraLegenda}
    />
  );
};

export default Legenda;
