import React, { useEffect } from "react";
import { Grid, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { elementos } from "@/main/constants/elementos";
import { PinDrop, Polyline } from "@mui/icons-material";
import CustomControlLeaftlet from "@/components/CustomControlLeaftlet/CustomControlLeaftlet";

export default function Elementos() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  const Icont = ({ elemento }) => {
    return (
      <IconButton
        aria-label={elemento.label}
        color={colorIcon(elemento.nome)}
        onClick={() => handleClick(elemento)}
      >
        {elemento.icon}
      </IconButton>
    );
  };

  const colorIcon = (nome) =>
    mapaContext?.elemento?.nome == nome ? "default" : "primary";

  const handleClick = (elemento) =>
    mapaContext?.elemento?.nome == elemento.nome
      ? dispatch({ type: "desativarElementos" })
      : dispatch({ type: "elementos", arg: elemento.nome });

  useEffect(() => {
    console.log(Object.keys(elementos).map((x) => elementos[x]));
  }, []);

  return (
    <SpeedDial ariaLabel="" icon={<SpeedDialIcon/>}>
      {Object.keys(elementos)
        .map((x) => elementos[x])
        .map((x) => (
          <SpeedDialAction icon={Icont({elemento: x})} ></SpeedDialAction>
        ))}
    </SpeedDial>
  );
}
