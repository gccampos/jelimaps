import {
  PinDrop,
  PanToolAlt,
  ShowChart,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import polygonIcon from "public/assets/polygonIcon.svg";
import SvgIcon, { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { ReactNode } from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { styled } from "@mui/material";

export type elementoProto = {
  nome: string;
  label: string;
  icon: ReactNode;
  iconComponent: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
};

const IconPersonalizado = () => {
  let lelr = styled(SvgIcon)<OverridableComponent<SvgIconTypeMap<{}, "svg">>>``;
  lelr.defaultProps = { ...lelr.defaultProps, inheritViewBox: true };
  //lelr.propTypes.inheritViewBox({}, "inheritViewBox", "svg", "svg", "svg");
  return lelr;
};
export const elementos: { [key: string]: elementoProto } = {
  Hand: {
    nome: "Hand",
    label: "Interagir com elementos",
    icon: <PanToolAlt />,
    iconComponent: PanToolAlt,
  } as elementoProto,
  Marker: {
    nome: "Marker",
    label: "Inserir Pinos no mapa",
    icon: <PinDrop />,
    iconComponent: PinDrop,
  },
  Polyline: {
    nome: "Polyline",
    label: "Inserir Linhas no mapa",
    icon: <ShowChart />,
    iconComponent: ShowChart,
  } as elementoProto,
  Polygon: {
    nome: "Polygon",
    label: "Inserir Polígonos no mapa",
    icon: <SvgIcon component={polygonIcon} inheritViewBox />,
    iconComponent: IconPersonalizado().withComponent(polygonIcon),
  } as elementoProto,
  Circle: {
    nome: "Circle",
    label: "Insira um Círculo no mapa",
    icon: <RadioButtonUnchecked />,
    iconComponent: RadioButtonUnchecked,
  } as elementoProto,
  // Rectangle: {
  //   nome: "Rectangle",
  //   label: "Insira um Retângulo no mapa",
  //   icon: <Crop54 />,
  // } as elementoProto,
};
