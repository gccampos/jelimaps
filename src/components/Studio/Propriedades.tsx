import React, { useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  ListSubheader,
  styled,
  Chip,
  Collapse,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material";
import { elementos } from "@/main/constants/elementos";
import Menu from "@mui/icons-material/Menu";
import { Rnd } from "react-rnd";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";

const WrapperStyled = styled("div")``;

const Dragger = styled("div")`
  cursor: e-resize;
  height: 100%;
`;

export default function Propriedades() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  const [larguraPropriedades, setLargurasPropriedades] = useState(250);

  const [open, setOpen] = React.useState(true);

  const handleCollapse = (e, x) => {
    console.log(x);
    setOpen(!open);
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
                          onClick={(evento) => handleCollapse(evento, x)}
                        >
                          <ListItemIcon sx={{ display: "inline-block" }}>
                            {elementos[x].icon}
                          </ListItemIcon>
                          {x + "s"}
                          {open ? <ExpandLess /> : <ExpandMore />}
                        </ListSubheader>
                        <Collapse
                          in={open}
                          className={x}
                          timeout="auto"
                          unmountOnExit
                        >
                          {mapaContext?.conteudo[x].map((z, il) => (
                            <ListItem
                              key={`ListItem#${z}-${il}`}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => {
                                    console.log(z)
                                    dispatch({
                                      type: "removeElement",
                                      elemento: z.dataRef,
                                      indiceElemento: il,
                                      nomeElemento: z.nome,
                                    });
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              }
                            >
                              <ListItemIcon>
                                <Menu />
                              </ListItemIcon>
                              <ListItemText primary={z.nome} />
                            </ListItem>
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
            </ListItem> */}
            </List>
          </Rnd>
        </div>
        {/* Lateral direita */}
      </Grid>
    )
  );
}
