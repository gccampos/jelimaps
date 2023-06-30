import React from "react";
import {
  Slide,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  makeStyles,
  Fab,
  IconButton,
  ListSubheader,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Delete, Drafts, Inbox } from "@mui/icons-material";
import { elementos } from "@/main/constants/elementos";
import Menu from "@mui/icons-material/Menu";

export default function Propriedades() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const ele = elementos;

  const handleListItemClick = (e, i) => {};

  return (
    mapaContext?.slidePropriedade && (
      <Grid item xs={0}>
        <Slide
          direction="left"
          in={mapaContext?.slidePropriedade}
          unmountOnExit
        >
          <div
            style={{
              width: 250,
              maxWidth: 500,
              height: "580px",
            }}
          >
            <List sx={{ overflow: "auto", height: "100%" }}>
              {mapaContext?.conteudo &&
                Object.keys(mapaContext?.conteudo).map(
                  (x) =>
                    mapaContext?.conteudo[x]?.length > 0 && (
                      <>
                        <ListSubheader>
                          <ListItemIcon>{ele.Marker.icon}</ListItemIcon>
                          {x + "s"}
                        </ListSubheader>
                        {mapaContext?.conteudo[x].map((z, i) => (
                          <ListItem
                            key={i}
                            onClick={(event) => handleListItemClick(event, 0)}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => {
                                  dispatch({
                                    type: "removeElement",
                                    elemento: z.dataRef,
                                    indiceElemento: i,
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
                            <ListItemText
                              primary={`${x}#${i} ${
                                z.dataRef ? "-" + z.dataRef : ""
                              }`}
                            />
                          </ListItem>
                        ))}
                        <Divider />
                      </>
                    )
                )}
              {/* <ListItem onClick={(event) => handleListItemClick(event, 0)}>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem> */}
            </List>
          </div>
        </Slide>
        {/* Lateral direita */}
      </Grid>
    )
  );
}
