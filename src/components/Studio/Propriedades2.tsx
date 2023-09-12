import React, { useEffect, useState } from "react";
import {
  Grid,
  styled,
  Chip,
  Tab,
  AppBar,
  Tabs,
  Box,
  List,
  ListSubheader,
  ListItemIcon,
  Collapse,
  ListItem,
  IconButton,
  ListItemButton,
  TextField,
  Divider,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Rnd } from "react-rnd";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import useWindowDimensions from "./useWindowDimensions";
import {
  Delete,
  ExpandLess,
  ExpandMore,
  Menu,
  Save,
} from "@mui/icons-material";
import { elementos } from "@/main/constants/elementos";

const Dragger = styled("div")`
  cursor: e-resize;
  height: 100%;
`;
const WrapperStyled = styled("div")``;

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

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
      sx: value === index ? { bgcolor: "#1976d245" } : {},
      value: index,
    };
  }
  const displaYNoneStyle = { display: "none" };

  useEffect(() => {
    if (mapaContext.elementoFoco || mapaContext.elementosFoco) setValue(2);
    // setTimeout(() => setValue(2), 10);
    else setValue(0);
    //setTimeout(() => setValue(0), 10);
  }, [mapaContext.elementoFoco, mapaContext.elementosFoco]);

  const handleCollapse = (e, x) => {
    dispatch({ type: "collapse", tipo: x, valorBooleano: e });
  };

  const handleCollapsePropriedades = (tipo, index, collapse) => {
    dispatch({
      type: "collapse",
      tipo: tipo,
      indiceElemento: index,
      valorBooleano: collapse,
    });
  };
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
                  <Tab label="Elemento" {...a11yProps(2)} />
                )}
                <Tab label="Geral" {...a11yProps(0)} />
                <Tab label="Cenas" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
              <TabPanel index={2}>Elemento</TabPanel>
            )}
            <TabPanel index={0}>Geral</TabPanel>
            <TabPanel index={1}>
              <List
                sx={{ overflow: "auto", height: "100%", pt: 0 }}
                key={"lista"}
              >
                {mapaContext?.conteudo &&
                  Object.keys(mapaContext?.conteudo).map(
                    (x, i) =>
                      mapaContext?.conteudo[x]?.length > 0 && (
                        <WrapperStyled key={`Wrapper#${x}-${i}`}>
                          <ListSubheader
                            onClick={() =>
                              handleCollapse(
                                !mapaContext?.conteudo[x].collapse,
                                x
                              )
                            }
                          >
                            <ListItemIcon sx={{ display: "inline-block" }}>
                              {elementos[x].icon}
                            </ListItemIcon>
                            {x + "s"}
                            {!mapaContext?.conteudo[x].collapse ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListSubheader>
                          <Collapse
                            in={!mapaContext?.conteudo[x].collapse}
                            className={x}
                            timeout="auto"
                            unmountOnExit
                          >
                            {mapaContext?.conteudo[x].map((z, il) => (
                              <>
                                <ListItem
                                  key={`ListItem#${z}-${il}`}
                                  secondaryAction={
                                    <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      onClick={() => {
                                        dispatch({
                                          type: "removeElement",
                                          tipo: z.dataRef,
                                          indiceElemento: il,
                                          nomeElemento: z.nome,
                                        });
                                      }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  }
                                >
                                  <ListItemButton
                                    onClick={() =>
                                      handleCollapsePropriedades(
                                        x,
                                        il,
                                        !z.collapse
                                      )
                                    }
                                  >
                                    <ListItemIcon>
                                      <Menu />
                                      {z.nome}
                                    </ListItemIcon>
                                  </ListItemButton>
                                </ListItem>
                                {!z.collapse && (
                                  <ListItem>
                                    <Collapse
                                      in={!z.collapse}
                                      timeout="auto"
                                      unmountOnExit
                                    >
                                      <form
                                        onSubmit={(event) => {
                                          console.log("onsubmit", event);
                                          //handleEditarPropriedade(event, z);
                                        }}
                                      >
                                        <TextField
                                          multiline
                                          defaultValue={z.texto}
                                          label="Texto"
                                          name="texto"
                                        />
                                        <IconButton type="submit">
                                          <Save />
                                        </IconButton>
                                      </form>
                                    </Collapse>
                                  </ListItem>
                                )}
                              </>
                            ))}
                          </Collapse>
                          <Divider />
                        </WrapperStyled>
                      )
                  )}
                {/* <ListItem onClick={(event) => handleListItemClick(event, 0)}>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem> 
             <Collapse
                                    in={openPropriedades}
                                    timeout="auto"
                                    unmountOnExit
                                    orientation="vertical"
                                  >
                                    <div>
                                      Texto
                                      <textarea value={z.texto}></textarea>
                                    </div>
                                  </Collapse>
                                  */}
              </List>
            </TabPanel>
            {/* {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
              <Typography>Existe um ou mais elementos selecionados</Typography>
            )} */}
          </Rnd>
        </div>
        {/* Lateral direita */}
      </Grid>
    )
  );
}
