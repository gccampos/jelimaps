import React, { useState } from "react";
import { Grid } from "@mui/material";
import { Rnd } from "react-rnd";
import useWindowDimensions from "@/components/Studio/useWindowDimensions";
import { Map } from "leaflet";
import DraggerResize from "@/components/DraggerResize";
import { tipoElemento } from "@/components/Mapa/mapaContextTypes";
const displaYNoneStyle = { display: "none" };

const LegendaLateral = (props: {
  map: Map;
  alturaLegenda: number;
  setAlturaLegenda: React.Dispatch<React.SetStateAction<number>>;
  elementosVisiveis: tipoElemento[];
  ConteudoLegenda: ({
    elementosVisiveis,
    larguraLegenda,
    map,
  }: {
    elementosVisiveis: tipoElemento[];
    map: Map;
    larguraLegenda: number;
  }) => React.JSX.Element;
}) => {
  const {
    map,
    setAlturaLegenda,
    alturaLegenda,
    ConteudoLegenda,
    elementosVisiveis,
  } = props;
  const { width, height } = useWindowDimensions();
  const [rndRef, setRndRef] = useState<Rnd>();

  return (
    <Rnd
      ref={(r) => {
        setRndRef(r);
      }}
      maxHeight={height * 0.9}
      minHeight={height * 0.05}
      resizeHandleStyles={{
        bottom: displaYNoneStyle,
        left: displaYNoneStyle,
        right: displaYNoneStyle,
        topLeft: displaYNoneStyle,
        topRight: displaYNoneStyle,
        bottomLeft: displaYNoneStyle,
        bottomRight: displaYNoneStyle,
        top: { height: 25 },
      }}
      resizeHandleComponent={{
        top: (
          <DraggerResize
            id={"parentSeletorResize"}
            sx={{
              borderStyle: "outset",
              borderBottom: 2,
              height: 20,
              backgroundColor: "#e2e2e2",
              marginTop: 0.6,
            }}
          ></DraggerResize>
        ),
      }}
      size={{ height: alturaLegenda, width: width }}
      disableDragging
      position={{ y: height - alturaLegenda, x: 0 }}
      onResize={(e, dir, ref) => {
        if (rndRef && rndRef.updatePosition)
          // rndRef?.updatePosition({ x: ref.offsetWidth, y: 0 });
          setAlturaLegenda(ref.offsetHeight);
      }}
    >
      <Grid
        item
        container
        xs={12}
        mt={2.2}
        sx={{ height: "95%", maxHeight: alturaLegenda }}
      >
        <ConteudoLegenda
          elementosVisiveis={elementosVisiveis}
          larguraLegenda={alturaLegenda}
          map={map}
        />
      </Grid>
    </Rnd>
  );
};

export default LegendaLateral;
