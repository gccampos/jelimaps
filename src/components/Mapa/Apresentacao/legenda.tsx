import React, { useState } from "react";
import { Grid, styled, Chip } from "@mui/material";
import { Rnd } from "react-rnd";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import useWindowDimensions from "@/components/Studio/useWindowDimensions";
const displaYNoneStyle = { display: "none" };

const Dragger = styled("div")`
  cursor: e-resize;
  height: 100%;
`;
const Legenda = () => {
  const { width, height } = useWindowDimensions();
  const [larguraLegenda, setLarguraLegenda] = useState(250);
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
          height: height,
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
              <Dragger>
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
              </Dragger>
            ),
          }}
          size={{ height: height, width: larguraLegenda }}
          disableDragging
          onResize={(e, dir, ref) => {
            console.log("onResize", ref.offsetWidth);
            if (rndRef && rndRef.updatePosition)
              // rndRef?.updatePosition({ x: ref.offsetWidth, y: 0 });
              setLarguraLegenda(ref.offsetWidth);
          }}
        >
          olaolaola
        </Rnd>
      </div>
      {/* Lateral direita */}
    </Grid>
  );
};

export default Legenda;
