import React from "react";
import { Grid } from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";

export default function LinhaTempo() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  return (
    <Grid item xs={12}>
      Linha do tempo
    </Grid>
  );
}
