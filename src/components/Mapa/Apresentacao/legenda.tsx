import React, { useState } from "react";
import {
  Grid,
  Chip,
  Paper,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { Rnd } from "react-rnd";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import useWindowDimensions from "@/components/Studio/useWindowDimensions";
import Leaflet, { Map } from "leaflet";
import contextChangers from "../ContextChangers";
import { useMapaContext } from "../MapaContext";
import DraggerResize from "@/components/DraggerResize";
import { tipoElemento } from "../mapaContextTypes";
const displaYNoneStyle = { display: "none" };

const Legenda = (props: {
  timelineSliderControl: Leaflet.TimelineSliderControl;
  map: Map;
  larguraLegenda: number;
  setLarguraLegenda: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { timelineSliderControl, map, setLarguraLegenda, larguraLegenda } =
    props;
  const mapaContext = useMapaContext();
  const { width, height } = useWindowDimensions();
  const [rndRef, setRndRef] = useState<Rnd>();
  const [mountado, setMontado] = useState(false);
  const eventeTimeoutRef = React.useRef(null);
  const eventAlterTimeoutRef = React.useRef(null);
  const [elementosVisiveis, setElementosVisiveis] = React.useState(
    contextChangers.retornaListaElementosConteudoCenaAtual(mapaContext)
  );
  const [cenaAtual, setCenaAtual] = useState(null);

  React.useEffect(() => {
    document.getElementById("seletorResize").parentElement.id =
      "parentSeletorResize";
  }, []);

  const eventify = function (arr, callback) {
    arr.push = function (e) {
      Array.prototype.push.call(arr, e);
      callback(arr);
    };
  };

  const moverMapaParaCena = React.useCallback(
    (cena: tipoElemento) => {
      try {
        if (cena.center) {
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
    if (timelineSliderControl?.container && !mountado) {
      eventify(timelineSliderControl.timelines, function () {
        clearTimeout(eventeTimeoutRef.current);
        eventeTimeoutRef.current = setTimeout(() => {
          timelineSliderControl.timelines.forEach((x) =>
            x.on("change", () => {
              clearTimeout(eventAlterTimeoutRef.current);
              eventAlterTimeoutRef.current = setTimeout(() => {
                const els =
                  contextChangers.retornaListaElementosConteudoCenaAtual(
                    mapaContext,
                    new Date(
                      parseInt(
                        timelineSliderControl.container.getElementsByTagName(
                          "input"
                        )[0].value
                      )
                    )
                  );
                if (!cenaAtual || cenaAtual.id !== els[0].id)
                  moverMapaParaCena(els[0]);
                setElementosVisiveis(els);
                eventAlterTimeoutRef.current = null;
              }, 10);
            })
          );
          eventeTimeoutRef.current = null;
        }, 10);
      });
      setMontado(true);
    }
  }, [
    cenaAtual,
    mapaContext,
    mountado,
    moverMapaParaCena,
    timelineSliderControl,
  ]);
  return (
    <Grid
      item
      xs={0}
      sx={{
        borderLeft: 2,
        borderLeftStyle: "outset",
      }}
    >
      <div
        style={{
          width: larguraLegenda,
          maxWidth: width * 0.5,
          minWidth: width * 0.05,
          height: "100%",
        }}
        id="foraDIv"
      >
        <Rnd
          ref={(r) => {
            setRndRef(r);
          }}
          maxWidth={width * 0.5}
          minWidth={width * 0.05}
          resizeHandleStyles={{
            left: displaYNoneStyle,
            topLeft: displaYNoneStyle,
            topRight: displaYNoneStyle,
            bottomLeft: displaYNoneStyle,
            bottomRight: displaYNoneStyle,
          }}
          resizeHandleComponent={{
            right: (
              <DraggerResize>
                <Chip
                  color="default"
                  size="small"
                  icon={<AlignVerticalCenterIcon />}
                  style={{
                    cursor: "e-resize",
                    position: "relative",
                    top: "50%",
                    right: 10,
                  }}
                />
              </DraggerResize>
            ),
          }}
          size={{ height: height, width: larguraLegenda }}
          disableDragging
          onResize={(e, dir, ref) => {
            if (rndRef && rndRef.updatePosition)
              // rndRef?.updatePosition({ x: ref.offsetWidth, y: 0 });
              setLarguraLegenda(ref.offsetWidth);
          }}
        >
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
                          height="140"
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
        </Rnd>
      </div>
      {/* Lateral direita */}
    </Grid>
  );
};

export default Legenda;
