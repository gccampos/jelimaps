import React, { useState } from "react";
import {
  Grid,
  styled,
  Chip,
  Typography,
  Tab,
  AppBar,
  Tabs,
  Box,
} from "@mui/material";
import {
  useMapaContext,
  //useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Rnd } from "react-rnd";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import useWindowDimensions from "./useWindowDimensions";

const Dragger = styled("div")`
  cursor: e-resize;
  height: 100%;
`;
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Propriedades(props: { altura: number }) {
  const { width } = useWindowDimensions();
  const mapaContext = useMapaContext();
  // const dispatch = useMapaDispatch();
  const [rndRef, setRndRef] = useState<Rnd>();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    handleChangeIndex(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const [larguraPropriedades, setLargurasPropriedades] = useState(250);

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
      sx: value === index ? { bgcolor: "#1976d245" } : {},
    };
  }
  const displaYNoneStyle = { display: "none" };
  return (
    mapaContext?.slidePropriedade && (
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
            width: larguraPropriedades,
            maxWidth: width * 0.6,
            minWidth: width * 0.1,
            height: props.altura,
          }}
          id="foraDIv"
        >
          <Rnd
            ref={(r) => {
              setRndRef(r);
            }}
            maxWidth={width * 0.6}
            minWidth={width * 0.1}
            resizeHandleStyles={{
              right: displaYNoneStyle,
              topLeft: displaYNoneStyle,
              topRight: displaYNoneStyle,
              bottomLeft: displaYNoneStyle,
              bottomRight: displaYNoneStyle,
            }}
            resizeHandleComponent={{
              left: (
                <Dragger>
                  <Chip
                    color="default"
                    size="small"
                    icon={<AlignVerticalCenterIcon />}
                    style={{
                      cursor: "e-resize",
                      position: "relative",
                      top: "50%",
                      left: 10,
                    }}
                  />
                </Dragger>
              ),
            }}
            size={{ height: props.altura, width: larguraPropriedades }}
            disableDragging
            onResize={(e, dir, ref) => {
              if (rndRef && rndRef.updatePosition)
                rndRef?.updatePosition({ x: width - ref.offsetWidth, y: 0 });
              setLargurasPropriedades(ref.offsetWidth);
            }}
          >
            <AppBar
              position="static"
              sx={{
                borderLeft: 2,
                borderLeftStyle: "inset",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                sx={{ bgcolor: "#e5e7eb" }}
                indicatorColor="secondary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Item One" {...a11yProps(0)} />
                {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
                  <Tab label="Item Two" {...a11yProps(1)} />
                )}
                {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
                  <Tab label="Item Three" {...a11yProps(2)} />
                )}
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              Item One
            </TabPanel>
            {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
              <>
                <TabPanel value={value} index={1}>
                  Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                  Item Three
                </TabPanel>
              </>
            )}
            {/* {(mapaContext.elementoFoco || mapaContext.elementosFoco) && (
              <Typography>Existe um ou mais elementos selecionados</Typography>
            )} */}
          </Rnd>
        </div>
        {/* Lateral direita */}
      </Grid>
    )
  );
}
