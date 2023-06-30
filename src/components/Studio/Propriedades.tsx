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
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Drafts, Inbox } from "@mui/icons-material";

export default function Propriedades() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  const handleListItemClick = (e, i) => {};

  return (
    mapaContext?.slidePropriedade && (
      <Grid item xs={0}>
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
                      <ListItem>
                        <ListItemIcon>
                          <Inbox />
                        </ListItemIcon>
                        <ListItemText primary={x} />
                      </ListItem>
                      {mapaContext?.conteudo[x].map((z, i) => (
                        <ListItem
                          onClick={(event) => handleListItemClick(event, 0)}
                        >
                          <ListItemIcon>
                            <Inbox />
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
        {/* Lateral direita */}
      </Grid>
    )
  );
}
