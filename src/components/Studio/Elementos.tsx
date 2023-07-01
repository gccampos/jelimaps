import React, { useState } from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { elementos } from "@/main/constants/elementos";

export default function Elementos() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [open, setOpen] = useState(false);

  const handleClick = (elemento) => {
    setOpen(!open);
    mapaContext?.elementoAdd?.nome == elemento.nome
      ? dispatch({ type: "elementos", arg: elementos.Hand })
      : dispatch({ type: "elementos", arg: elemento });
  };

  return (
    <SpeedDial
      ariaLabel=""
      icon={<SpeedDialIcon icon={mapaContext?.elementoAdd?.icon} />}
      open={open}
      onClick={() => setOpen(!open)}
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
