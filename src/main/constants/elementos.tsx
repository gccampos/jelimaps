import {
  PinDrop,
  PanToolAlt,
  ShowChart,
  RadioButtonUnchecked,
  Crop54,
} from "@mui/icons-material";
import polygonIcon from "public/assets/polygonIcon.svg";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactNode } from "react";

export type elementoProto = {
  nome: string;
  label: string;
  icon: ReactNode;
};

export const elementos: { [key: string]: elementoProto } = {
  Hand: {
    nome: "Hand",
    label: "Interagir com elementos",
    icon: <PanToolAlt />,
  } as elementoProto,
  Marker: { nome: "Marker", label: "Inserir Pinos no mapa", icon: <PinDrop /> },
  Polyline: {
    nome: "Polyline",
    label: "Inserir Linhas no mapa",
    icon: <ShowChart />,
  } as elementoProto,
  Polygon: {
    nome: "Polygon",
    label: "Inserir Polígonos no mapa",
    icon: <SvgIcon component={polygonIcon} inheritViewBox />,
  } as elementoProto,
  Circle: {
    nome: "Circle",
    label: "Insira um Círculo no mapa",
    icon: <RadioButtonUnchecked />,
  } as elementoProto,
  Rectangle: {
    nome: "Rectangle",
    label: "Insira um Retângulo no mapa",
    icon: <Crop54 />,
  } as elementoProto,
};
