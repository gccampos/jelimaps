import React from "react";
import {
  Collapse,
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
  styled,
} from "@mui/material";
//import Image from "next/image";
//import timeline from "public/timeline.png";
import { useMapaContext, useMapaDispatch } from "../Mapa/context/MapaContext";
import { Delete, ExpandLess, ExpandMore, Menu } from "@mui/icons-material";
import { elementos } from "@/main/constants/elementos";

const WrapperStyled = styled("div")``;

export default function LinhaTempo() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  return (
    <Grid
      id={"oi"}
      item
      xs={12}
      sx={{
        height: "100%",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: 7,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "darkgrey",
          outline: `1px solid slategrey`,
        },
      }}
    >
      {/* <Typography>Linha do Tempo</Typography>
      <Image
        src={timeline}
        alt="linha do tempo falsa"
        style={{ width: "100%", maxWidth: props.maxWidth }}
      /> */}
      {mapaContext?.conteudo &&
        Object.keys(mapaContext?.conteudo).map(
          (x, i) =>
            mapaContext?.conteudo[x]?.length > 0 && (
              <WrapperStyled key={`Wrapper#${x}-${i}`}>
                <ListSubheader
                  disableSticky
                  onClick={
                    () => {}
                    //handleCollapse(!mapaContext?.conteudo[x].collapse, x)
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
                          onClick={
                            () => {}
                            //handleCollapsePropriedades(x, il, !z.collapse)
                          }
                        >
                          <ListItemIcon>
                            <Menu />
                            {z.nome}
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                    </>
                  ))}
                </Collapse>
                <Divider />
              </WrapperStyled>
            )
        )}
    </Grid>
  );
}
