import React from "react";
import { Grid } from "@mui/material";
import Image from "next/image";
import timeline from "public/timeline.png";

export default function LinhaTempo(props: { maxWidth: number }) {
  return (
    <Grid item xs={12}>
      {/* <Typography>Linha do Tempo</Typography> */}
      <Image
        src={timeline}
        alt="linha do tempo falsa"
        style={{ width: "100%", maxWidth: props.maxWidth }}
      />
    </Grid>
  );
}
