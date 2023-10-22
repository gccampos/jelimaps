import React from "react";
import { Grid } from "@mui/material";
import VisTimeline from "./VisTimeline";

export default function LinhaTempo(props: {
  tempoAtualRef: React.MutableRefObject<any>;
  altura: number;
}) {
  return (
    <Grid
      id={"oi"}
      item
      xs={12}
      sx={{
        height: "100%",
        ".personalized-scrollbar": {
          height: "100%",
          // "div:first-child": {
          //   height: "100%",
          // },
          ".vis-timeline": {
            height: "100% !important",
          },
          ".vis-vertical-scroll": {
            "&::-webkit-scrollbar": {
              width: 7,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "darkgrey",
              outline: `1px solid slategrey`,
            },
          },
        },
      }}
    >
      <VisTimeline tempoAtualRef={props.tempoAtualRef} altura={props.altura} />
    </Grid>
  );
}
