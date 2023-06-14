import React from "react";
import { Grid, IconButton } from "@mui/material";
import { PinDrop, Polyline } from "@mui/icons-material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";

export default function Elementos() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  return (
    <Grid item xs={0.5}>
      <IconButton
        aria-label="Pin"
        color={mapaContext?.elemento?.nome == "pin" ? "default" : "primary"}
        onClick={() => {
          mapaContext?.elemento?.nome == "pin"
            ? dispatch({ type: "desativarElementos" })
            : dispatch({ type: "elementos", arg: "pin" });
        }}
      >
        <PinDrop />
      </IconButton>
      <IconButton
        aria-label="Polygon"
        color={mapaContext?.elemento?.nome == "pol" ? "default" : "primary"}
        onClick={() =>
          mapaContext?.elemento?.nome == "pol"
            ? dispatch({ type: "desativarElementos" })
            : dispatch({ type: "elementos", arg: "pol" })
        }
      >
        <Polyline />
      </IconButton>
    </Grid>
  );
}
