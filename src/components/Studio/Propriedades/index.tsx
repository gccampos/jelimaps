import React, { useEffect, useState } from "react";
import {
  Grid,
  styled,
  Chip,
  Tab,
  AppBar,
  Tabs,
  Box,
  TextField,
  FormControlLabel,
  Switch,
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
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Pause, PlayArrow, Stop } from "@mui/icons-material";

const Dragger = styled("div")`
  cursor: e-resize;
  height: 100%;
`;

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
}

export default function Propriedades(props: { altura: number }) {
  const { width } = useWindowDimensions();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [rndRef, setRndRef] = useState<Rnd>();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function TabPanel(props: TabPanelProps) {
    const { children, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  const [larguraPropriedades, setLargurasPropriedades] = useState(250);

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
    setValue(mapaContext.elementoFoco || mapaContext.elementosFoco ? 2 : 0);
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
            height: props.altura,
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
            size={{ height: props.altura, width: larguraPropriedades }}
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
            >
              <Tabs
                value={value}
                onChange={handleChange}
                sx={{ bgcolor: "#e5e7eb" }}
                indicatorColor="secondary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
                  <Tab label="Elemento" {...propriedadesTab(2)} />
                )}
                <Tab label="Geral" {...propriedadesTab(0)} />
                <Tab label="Cenas" {...propriedadesTab(1)} />
              </Tabs>
            </AppBar>
            {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
              <TabPanel index={2}>Elemento</TabPanel>
            )}
            <TabPanel index={0}>
              <Formik
                initialValues={mapaContext}
                onSubmit={() => console.log("submtou")}
                validateOnBlur={true}
                validationSchema={Yup.object({
                  cenaInicio: Yup.date().max(
                    mapaContext.conteudo.cenas[0].cenaFim,
                    "O inicio deve ser menor que o final da primeira cena."
                  ),
                  cenaFim: Yup.date().min(
                    mapaContext.conteudo.cenas[
                      mapaContext.conteudo.cenas.length - 1
                    ].cenaInicio,
                    "O final deve ser maior que o inicio da ultima cena."
                  ),
                })}
              >
                {(formik) => {
                  return (
                    <Form
                      onBlur={(e: any) => {
                        dispatch({
                          type: "alteraPropriedadeGeral",
                          tipo: e.target.name,
                          valor: e.target.value,
                          formik: formik,
                        });
                      }}
                    >
                      <TextField
                        fullWidth
                        id="cenaInicio"
                        name="cenaInicio"
                        label="Inicio"
                        type="datetime-local"
                        value={formik.values.cenaInicio}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.cenaInicio &&
                          Boolean(formik.errors.cenaInicio)
                        }
                        helperText={
                          formik.touched.cenaInicio && formik.errors.cenaInicio
                        }
                      />
                      <TextField
                        fullWidth
                        id="cenaFim"
                        name="cenaFim"
                        label="Final"
                        type="datetime-local"
                        value={formik.values.cenaFim}
                        inputProps={{
                          step: 1,
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.cenaFim &&
                          Boolean(formik.errors.cenaFim)
                        }
                        helperText={
                          formik.touched.cenaFim && formik.errors.cenaFim
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik.values.reloadTimelineOptions}
                            onChange={(e, c) => {
                              dispatch({
                                type: "alteraPropriedadeGeral",
                                tipo: e.target.name,
                                valor: c,
                                formik: formik,
                              });
                            }}
                            name={"reloadTimelineOptions"}
                          />
                        }
                        label={"Recarregar linha do tempo"}
                      />
                      {/* <FormControlLabel
                        control={
                          <Switch
                            checked={
                              formik.values.timelineOptions.showCurrentTime
                            }
                            onChange={(e, b) => {
                              console.log("tentando mudar switch", b);
                              dispatch({
                                type: "alteraPropriedadeTimelineOptions",
                                tipo: e.target.name,
                                valor: b,
                                formik: formik,
                              });
                            }}
                            name={"showCurrentTime"}
                          />
                        }
                        label={
                          formik.values.timelineOptions.showCurrentTime
                            ? "Stop"
                            : "Play"
                        }
                      /> */}
                    </Form>
                  );
                }}
              </Formik>
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
            >
              <BottomNavigation
                onChange={(e, i) => {
                  dispatch({
                    type: "alteraPropriedadeGeral",
                    tipo: "playStatus",
                    valor: i,
                  });
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
