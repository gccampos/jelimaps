import React, { useState } from "react";
import { Grid, Chip } from "@mui/material";
import { Rnd } from "react-rnd";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import useWindowDimensions from "@/components/Studio/useWindowDimensions";
import { Map } from "leaflet";
import DraggerResize from "@/components/DraggerResize";
import { tipoElemento } from "@/components/Mapa/mapaContextTypes";
import ReprodutorLinhaTempo from "../../ReprodutorLinhaTempo";
const displaYNoneStyle = { display: "none" };

const LegendaLateral = (props: {
  map: Map;
  larguraLegenda: number;
  setLarguraLegenda: React.Dispatch<React.SetStateAction<number>>;
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
    setLarguraLegenda,
    larguraLegenda,
    ConteudoLegenda,
    elementosVisiveis,
  } = props;
  const { width, height } = useWindowDimensions();
  const [rndRef, setRndRef] = useState<Rnd>();

  return (
    <Grid
      item
      xs={0}
      sx={{
        borderLeft: 2,
        borderLeftStyle: "outset",
      }}
    >
      <div
        style={{
          width: larguraLegenda,
          maxWidth: width * 0.5,
          minWidth: width * 0.05,
          height: "100%",
        }}
        id="foraDIv"
      >
        <Rnd
          ref={(r) => {
            setRndRef(r);
          }}
          maxWidth={width * 0.5}
          minWidth={width * 0.05}
          resizeHandleStyles={{
            left: displaYNoneStyle,
            topLeft: displaYNoneStyle,
            topRight: displaYNoneStyle,
            bottomLeft: displaYNoneStyle,
            bottomRight: displaYNoneStyle,
          }}
          resizeHandleComponent={{
            right: (
              <DraggerResize>
                <Chip
                  color="default"
                  size="small"
                  icon={<AlignVerticalCenterIcon />}
                  style={{
                    cursor: "e-resize",
                    position: "relative",
                    top: "50%",
                    right: 10,
                  }}
                />
              </DraggerResize>
            ),
          }}
          size={{ height: height, width: larguraLegenda }}
          disableDragging
          onResize={(e, dir, ref) => {
            if (rndRef && rndRef.updatePosition)
              // rndRef?.updatePosition({ x: ref.offsetWidth, y: 0 });
              setLarguraLegenda(ref.offsetWidth);
          }}
        >
          <ConteudoLegenda
            elementosVisiveis={elementosVisiveis}
            larguraLegenda={larguraLegenda}
            map={map}
          />
          <ReprodutorLinhaTempo isApresentacao={true} />
        </Rnd>
      </div>
      {/* Lateral direita */}
    </Grid>
  );
};

export default LegendaLateral;
