import React from "react";
import { styled, List, ListSubheader, Collapse, Divider } from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const WrapperStyled = styled("div")``;

export default function Cenas() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  return (
    <List sx={{ overflow: "auto", height: "100%", pt: 0 }} key={"lista"}>
      {mapaContext?.conteudo.cenas &&
        mapaContext?.conteudo.cenas.map((x, i) => (
          <WrapperStyled key={`Wrapper#${x}-${i}`}>
            <ListSubheader
              onClick={() => {
                mapaContext.conteudo.cenas[i].collapse =
                  !mapaContext.conteudo.cenas[i].collapse;
                dispatch({
                  type: "trocaMapaContext",
                  mapContext: { ...mapaContext },
                });
              }}
            >
              {x.nome}
              {!mapaContext?.conteudo.cenas[i].collapse ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListSubheader>
            <Collapse
              in={!mapaContext?.conteudo.cenas[i].collapse}
              className={x.nome}
              timeout="auto"
              unmountOnExit
            >
              ola
            </Collapse>
            <Divider />
          </WrapperStyled>
        ))}
    </List>
  );
}
