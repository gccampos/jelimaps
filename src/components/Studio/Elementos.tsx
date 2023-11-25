import React, { useState } from "react";
import {
  Grid,
  List,
  ListItem,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
} from "@mui/material";
import { useMapaContext, useMapaDispatch } from "@/components/Mapa/MapaContext";
import { elementos } from "@/main/constants/elementos";
import useWindowDimensions from "./useWindowDimensions";
import styled from "@emotion/styled";
import { TerraDraw } from "terra-draw";

export function ElementosLateral(props: { altura: number; draw: TerraDraw }) {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const handleClick = (elemento) => {
    props.draw.setMode(elemento.nome);
    mapaContext?.elementoInteracao?.nome == elemento.nome
      ? dispatch({ type: "selecionarElementoInteracao", arg: elementos.Hand })
      : dispatch({ type: "selecionarElementoInteracao", arg: elemento });
  };
  return (
    <Grid
      item
      xs={0}
      sx={{
        borderRight: 2,
        borderRightStyle: "outset",
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
      <List
        sx={{
          height: props.altura,
          width: 55,
          borderRight: 2,
          borderRightStyle: "inset",
          pt: 0,
        }}
      >
        {Object.keys(elementos)
          .map((x) => elementos[x])
          .map((x, i) => {
            const StyledIcon = styled(x.iconComponent)`
              height: 24px;
            `;
            return (
              <Tooltip key={i} title={x.label}>
                <ListItem
                  sx={{
                    width: "100%",
                    mb: 1,
                    cursor: "pointer",

                    backgroundColor:
                      mapaContext?.elementoInteracao?.nome === x.nome
                        ? "#1976d245"
                        : "",
                    borderRadius: 1,
                    //height: props.altura * 0.1,
                  }}
                  onClick={() => handleClick(x)}
                >
                  <StyledIcon sx={{}} />
                  {/* <ListItemIcon sx={{}}>{x.icon}</ListItemIcon> */}
                </ListItem>
              </Tooltip>
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
