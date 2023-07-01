import React from "react";
import Propriedades from "./Propriedades";
import LinhaTempo from "./LinhaTempo";
import { Grid } from "@mui/material";
import Mapa from "./Mapa";

const Studio = () => {
  return (
    <Grid container sx={{ height: "100%" }} id="studioMapa">
      <Grid item container xs={12}>
        <Mapa />
        <Propriedades />
      </Grid>
      <Grid item container xs={12}>
        <LinhaTempo />
      </Grid>
    </Grid>
  );
};

export default Studio;
