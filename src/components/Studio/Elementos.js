import React, { useEffect } from "react";
import {
  Grid,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { elementos } from "@/main/constants/elementos";
import { PinDrop, Polyline } from "@mui/icons-material";
import CustomControlLeaflet from "@/components/CustomControlLeaflet/CustomControlLeaflet";
import IceSkatingIcon from "@mui/icons-material/IceSkating";

export default function Elementos() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  const handleClick = (elemento) =>
    mapaContext?.elementoAdd?.nome == elemento.nome
      ? dispatch({ type: "elementos", arg: elementos.Hand })
      : dispatch({ type: "elementos", arg: elemento });

  useEffect(() => {
    console.log(Object.keys(elementos).map((x) => elementos[x]));
  }, []);

  return (
    <SpeedDial
      ariaLabel=""
      icon={<SpeedDialIcon icon={mapaContext?.elementoAdd?.icon} />}
    >
      {Object.keys(elementos)
        .map((x) => elementos[x])
        .map((x, i) => (
          <SpeedDialAction
            key={i}
            icon={x.icon}
            aria-label={x.label}
            onClick={() => handleClick(x)}
          />
        ))}
    </SpeedDial>
  );
}
