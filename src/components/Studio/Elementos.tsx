import React, { useState } from "react";
import {
  Grid,
  List,
  ListItem,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { elementos } from "@/main/constants/elementos";
import useWindowDimensions from "./useWindowDimensions";
import styled from "@emotion/styled";

export function ElementosLateral(props: { altura: number }) {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const handleClick = (elemento) => {
    mapaContext?.elementoInteracao?.nome == elemento.nome
      ? dispatch({ type: "selecionarElementoInteracao", arg: elementos.Hand })
      : dispatch({ type: "selecionarElementoInteracao", arg: elemento });
  };
  return (
    <Grid
      item
      xs={0}
      sx={{
        height: props.altura,
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: 5,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "darkgrey",
          outline: `1px solid slategrey`,
        },
      }}
    >
      <List sx={{ height: props.altura, width: 55 }}>
        {Object.keys(elementos)
          .map((x) => elementos[x])
          .map((x, i) => {
            const StyledIcon = styled(x.iconComponent)`
              height: 24px;
            `;
            return (
              <ListItem
                key={i}
                sx={{
                  width: "100%",
                  mb: 1,
                  cursor: "pointer",
                  //height: props.altura * 0.1,
                }}
                onClick={() => handleClick(x)}
              >
                <StyledIcon />
                {/* <ListItemIcon sx={{}}>{x.icon}</ListItemIcon> */}
              </ListItem>
            );
          })}
      </List>
    </Grid>
  );
}

export default function Elementos(props: { altura: number }) {
  const mapaContext = useMapaContext();
  const { width } = useWindowDimensions();
  const dispatch = useMapaDispatch();
  const [open, setOpen] = useState(false);

  const handleClick = (elemento) => {
    setOpen(!open);
    mapaContext?.elementoInteracao?.nome == elemento.nome
      ? dispatch({ type: "selecionarElementoInteracao", arg: elementos.Hand })
      : dispatch({ type: "selecionarElementoInteracao", arg: elemento });
  };

  return (
    <SpeedDial
      ariaLabel=""
      icon={<SpeedDialIcon icon={mapaContext?.elementoInteracao?.icon} />}
      open={open}
      onClick={() => setOpen(!open)}
      sx={{
        height: props.altura - 88,
        width: width,
        alignItems: "end",
        position: "absolute",
        bottom: 16,
        right: 0,
        "#-actions": {
          height: "100%",
          width: "100%",
          alignItems: "end",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: 15,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            outline: `1px solid slategrey`,
          },
        },
      }}
    >
      {open &&
        Object.keys(elementos)
          .map((x) => elementos[x])
          .map((x, i) => (
            <SpeedDialAction
              key={i}
              icon={x.icon}
              tooltipTitle={x.label}
              tooltipOpen
              sx={{ width: "max-content" }}
              onClick={() => handleClick(x)}
            />
          ))}
    </SpeedDial>
  );
}
