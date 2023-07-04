import React, { useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  IconButton,
  ListSubheader,
  styled,
  Chip,
  Collapse,
  ListItemButton,
  TextField,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Delete, ExpandLess, ExpandMore, Save } from "@mui/icons-material";
import { elementos } from "@/main/constants/elementos";
import Menu from "@mui/icons-material/Menu";
import { Rnd } from "react-rnd";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import { elementoPadrao } from "../Mapa/context/mapaContextTypes";

const WrapperStyled = styled("div")``;

const Dragger = styled("div")`
  cursor: e-resize;
  height: 100%;
`;

export default function Propriedades() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  const [larguraPropriedades, setLargurasPropriedades] = useState(250);

  const handleCollapse = (e, x) => {
    dispatch({ type: "collapse", tipo: x, valorBooleano: e });
  };

  const handleEditarPropriedade = (event, elemento: elementoPadrao) => {
    event.preventDefault();
    dispatch({
      type: "editarPropriedade",
      tipo: elemento.dataRef,
      nomeElemento: elemento.nome,
      nomePropriedade: event.currentTarget.elements["texto"].name,
      valorPropriedade: event.currentTarget.elements["texto"].value,
    });
  };

  const handleCollapsePropriedades = (tipo, index, collapse) => {
    dispatch({
      type: "collapse",
      tipo: tipo,
      indiceElemento: index,
      valorBooleano: collapse,
    });
  };

  const displaYNoneStyle = { display: "none" };
  return (
    mapaContext?.slidePropriedade && (
      <Grid item xs={0}>
        <div
          style={{
            width: larguraPropriedades,
            maxWidth: 500,
            minWidth: 190,
            height: "580px",
          }}
        >
          <Rnd
            maxWidth={500}
            minWidth={190}
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
            size={{ height: 580, width: larguraPropriedades }}
            disableDragging
            onResize={(e, dir, ref) => {
              setLargurasPropriedades(ref.offsetWidth);
            }}
          >
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
                              <ListItem>
                                <Collapse
                                  in={!z.collapse}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <form
                                    onSubmit={(event) => {
                                      handleEditarPropriedade(event, z);
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
          </Rnd>
        </div>
        {/* Lateral direita */}
      </Grid>
    )
  );
}
