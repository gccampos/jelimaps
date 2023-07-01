import React from "react";
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
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Delete } from "@mui/icons-material";
import { elementos } from "@/main/constants/elementos";
import Menu from "@mui/icons-material/Menu";

const WrapperStyled = styled("div")``;

export default function Propriedades() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

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
          <List sx={{ overflow: "auto", height: "100%", pt: 0 }} key={"lista"}>
            {mapaContext?.conteudo &&
              Object.keys(mapaContext?.conteudo).map(
                (x, i) =>
                  mapaContext?.conteudo[x]?.length > 0 && (
                    <WrapperStyled key={`Wrapper#${x}-${i}`}>
                      <ListSubheader>
                        <ListItemIcon sx={{ display: "inline-block" }}>
                          {elementos[x].icon}
                        </ListItemIcon>
                        {x + "s"}
                      </ListSubheader>
                      {mapaContext?.conteudo[x].map((z, il) => (
                        <ListItem
                          key={`ListItem#${z}-${il}`}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => {
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
        </div>
        {/* Lateral direita */}
      </Grid>
    )
  );
}
