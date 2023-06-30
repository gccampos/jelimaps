import React from "react";
import { Grid, Typography } from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";

export default function LinhaTempo() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  return (
    <Grid item xs={12}>
      <Typography>Linha do Tempo</Typography>
      <img width={"100%"} src="/timeline.png" />
    </Grid>
  );
}
