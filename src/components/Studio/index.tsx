import React, { useState } from "react";
import Propriedades from "./Propriedades";
import LinhaTempo from "./LinhaTempo";
import { Grid } from "@mui/material";
import Mapa from "./Mapa";
import { Rnd } from "react-rnd";
import useWindowDimensions from "./useWindowDimensions";

const Studio = () => {
  const { height } = useWindowDimensions();
  const [rndRef, setRndRef] = useState<Rnd>();
  const [altura, setAltura] = useState(height * 0.2);
  const displaYNoneStyle = { display: "none" };
  const resizeHandleStylesObject = {
    bottom: displaYNoneStyle,
    left: displaYNoneStyle,
    right: displaYNoneStyle,
    topLeft: displaYNoneStyle,
    topRight: displaYNoneStyle,
    bottomLeft: displaYNoneStyle,
    bottomRight: displaYNoneStyle,
  };
  return (
    <Grid container sx={{ height: "100%" }} id="studioMapa">
      <Grid item container xs={12}>
        <Mapa altura={height - altura} />
        <Propriedades />
      </Grid>
      <Rnd
        ref={(c) => {
          setRndRef(c);
        }}
        maxHeight={height * 0.5}
        minHeight={height * 0.05}
        resizeHandleStyles={resizeHandleStylesObject}
        size={{ height: altura, width: "100%" }}
        disableDragging
        position={{ y: height - altura, x: 0 }}
        onResize={(e, dir, ref) => {
          if (rndRef && rndRef.updatePosition)
            rndRef?.updatePosition({ x: 0, y: height - ref.offsetHeight });
          setAltura(ref.offsetHeight);
        }}
      >
        <Grid item container xs={12}>
          <LinhaTempo maxWidth={altura} />
        </Grid>
      </Rnd>
    </Grid>
  );
};

export default Studio;
