import React from "react";
import Elementos from "./Elementos";
import Propriedades from "./Propriedades";
import LinhaTempo from "./LinhaTempo";
import { Grid } from "@mui/material";
import Mapa from "./Mapa";

const Studio = () => {
  return (
    <Grid container spacing={2} sx={{}} id="studioMapa">
      <Mapa />
      {/* <Propriedades /> */}
      <LinhaTempo />
    </Grid>
  );
};

export default Studio;
