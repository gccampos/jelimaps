import { PinDrop, PanToolAlt, ShowChart, RadioButtonUnchecked, Crop54 } from "@mui/icons-material";
import polygonIcon from "public/assets/polygonIcon.svg";
import SvgIcon from "@mui/material/SvgIcon";

export const elementos = {
  Hand: {
    nome: "Hand",
    label: "Interagir com elementos",
    icon: <PanToolAlt />,
  },
  Marker: { nome: "Marker", label: "Inserir Pinos no mapa", icon: <PinDrop /> },
  Polyline: {
    nome: "Polyline",
    label: "Inserir Linhas no mapa",
    icon: <ShowChart />,
  },
  Polygon: {
    nome: "Polygon",
    label: "Inserir Polígonos no mapa",
    icon: <SvgIcon component={polygonIcon} inheritViewBox />,
  },
  Circle: {
    nome: "Circle",
    label: "Insira um Círculo no mapa",
    icon: <RadioButtonUnchecked/>
  },
  Rectangue: {
    nome: "Rectangle",
    label: "Insira um Retângulo no mapa",
    icon: <Crop54/>
  }
};
