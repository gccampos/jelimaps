import React from "react";
import { Grid } from "@mui/material";
import VisTimeline from "./VisTimeline";

export default function LinhaTempo() {

  return (
    <Grid
      id={"oi"}
      item
      xs={12}
      sx={{
        height: "100%",
        ".personalized-scrollbar": {
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: 7,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            outline: `1px solid slategrey`,
          },
        },
      }}
    >
      <VisTimeline />
    </Grid>
  );
}
