import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  styled,
  Chip,
  Tab,
  AppBar,
  Tabs,
  Box,
  BottomNavigation,
  Paper,
  BottomNavigationAction,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Rnd } from "react-rnd";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import useWindowDimensions from "../useWindowDimensions";
import Cenas from "./cenas";
import { Pause, PlayArrow, Stop } from "@mui/icons-material";
import Geral from "./geral";
import Elemento from "./elemento";
import moment from "moment";
import { setInterval, clearInterval } from "timers";

const Dragger = styled("div")`
  cursor: e-resize;
  height: 100%;
`;

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
}

export default function Propriedades(props: {
  altura: number;
  tempoAtualRef: any;
  larguraPropriedades: number;
  setLargurasPropriedades: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    altura,
    tempoAtualRef,
    larguraPropriedades,
    setLargurasPropriedades,
  } = props;
  const { width } = useWindowDimensions();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [rndRef, setRndRef] = useState<Rnd>();
  const [value, setValue] = React.useState(0);
  const tocadorRef = useRef(null);
  const headerTabRef = useRef(null);
  const [intervalId, setIntervalId] = React.useState(null);
  const tempoAtual = React.useRef(mapaContext.tempo);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  tempoAtual.current = mapaContext.tempo;

  const handleIntervaloAtualizaTempo = React.useCallback(() => {
    const time = mapaContext.playStatus
      ? moment(tempoAtual.current)
          .add(1, "seconds")
          .format("yyyy-MM-DDTHH:mm:ss")
      : mapaContext.cenaInicio;
    dispatch({
      type: "atualizaTempo",
      time,
    });
    tempoAtualRef.current = time;
  }, [mapaContext, tempoAtualRef, dispatch, tempoAtual]);

  function TabPanel(props: TabPanelProps) {
    const { children, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        style={{
          maxHeight:
            headerTabRef?.current && tocadorRef?.current
              ? altura -
                tocadorRef.current.offsetHeight -
                headerTabRef.current.offsetHeight
              : altura * 0.75,
          overflow: "auto",
        }}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function propriedadesTab(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
      sx: value === index ? { bgcolor: "#1976d245" } : {},
      value: index,
    };
  }
  const displaYNoneStyle = { display: "none" };

  useEffect(() => {
    const val =
      mapaContext.elementoFoco ||
      (mapaContext.elementosFoco && mapaContext.elementosFoco.length)
        ? 2
        : 0;
    setValue(val);
  }, [mapaContext.elementoFoco, mapaContext.elementosFoco]);

  return (
    mapaContext?.slidePropriedade && (
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
            width: larguraPropriedades,
            maxWidth: width * 0.6,
            minWidth: width * 0.1,
            height: altura,
          }}
          id="foraDIv"
        >
          <Rnd
            ref={(r) => {
              setRndRef(r);
            }}
            maxWidth={width * 0.6}
            minWidth={width * 0.1}
            resizeHandleStyles={{
              right: displaYNoneStyle,
              topLeft: displaYNoneStyle,
              topRight: displaYNoneStyle,
              bottomLeft: displaYNoneStyle,
              bottomRight: displaYNoneStyle,
            }}
            resizeHandleComponent={{
              left: (
                <Dragger>
                  <Chip
                    color="default"
                    size="small"
                    icon={<AlignVerticalCenterIcon />}
                    style={{
                      cursor: "e-resize",
                      position: "relative",
                      top: "50%",
                      left: 10,
                    }}
                  />
                </Dragger>
              ),
            }}
            size={{ height: altura, width: larguraPropriedades }}
            disableDragging
            onResize={(e, dir, ref) => {
              if (rndRef && rndRef.updatePosition)
                rndRef?.updatePosition({ x: width - ref.offsetWidth, y: 0 });
              setLargurasPropriedades(ref.offsetWidth);
            }}
          >
            <AppBar
              position="static"
              sx={{
                borderLeft: 2,
                borderLeftStyle: "inset",
              }}
              ref={headerTabRef}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                sx={{ bgcolor: "#e5e7eb" }}
                indicatorColor="secondary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                {(
                  mapaContext.elementosFoco?.concat(
                    mapaContext.elementoFoco
                  ) ?? [mapaContext.elementoFoco]
                ).filter((x) => !!x).length > 0 && (
                  <Tab label="Elemento" {...propriedadesTab(2)} />
                )}
                <Tab label="Geral" {...propriedadesTab(0)} />
                <Tab label="Cenas" {...propriedadesTab(1)} />
              </Tabs>
            </AppBar>
            {(
              mapaContext.elementosFoco?.concat(mapaContext.elementoFoco) ?? [
                mapaContext.elementoFoco,
              ]
            ).filter((x) => !!x).length > 0 && (
              <TabPanel index={2}>
                <Elemento />
              </TabPanel>
            )}
            <TabPanel index={0}>
              <Geral />
            </TabPanel>
            <TabPanel index={1}>
              <Cenas />
            </TabPanel>
            {/* {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
              <Typography>Existe um ou mais elementos selecionados</Typography>
            )} */}
            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
              ref={tocadorRef}
            >
              <BottomNavigation
                onChange={(e, i) => {
                  dispatch({
                    type: "alteraPropriedadeGeral",
                    tipo: "playStatus",
                    valor: i,
                  });

                  if (!intervalId && i > 0) {
                    const idInterval = setInterval(
                      handleIntervaloAtualizaTempo,
                      1000
                    );
                    setIntervalId(idInterval);
                  } else {
                    clearInterval(intervalId);
                    setIntervalId(null);
                    tempoAtualRef.current = i
                      ? tempoAtual.current
                      : mapaContext.conteudo.cenas[0].cenaInicio;
                    dispatch({
                      type: "atualizaTempo",
                      time: tempoAtualRef.current,
                    });
                  }
                }}
              >
                <BottomNavigationAction
                  label="Play"
                  icon={<PlayArrow />}
                  disabled={mapaContext.playStatus > 0}
                  value={1}
                />
                <BottomNavigationAction
                  label="Pause"
                  icon={<Pause />}
                  disabled={mapaContext.playStatus < 1}
                  value={-1}
                />
                <BottomNavigationAction
                  label="Stop"
                  icon={<Stop />}
                  disabled={mapaContext.playStatus === 0}
                  value={0}
                />
              </BottomNavigation>
            </Paper>
          </Rnd>
        </div>
        {/* Lateral direita */}
      </Grid>
    )
  );
}
