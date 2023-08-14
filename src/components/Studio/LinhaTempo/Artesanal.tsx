import React from "react";
import {
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "../../Mapa/context/MapaContext";
import { Delete, Menu } from "@mui/icons-material";
import { elementoPadrao } from "../../Mapa/context/mapaContextTypes";
import { ReactSortable } from "react-sortablejs";
import styled from "@emotion/styled";
// import useWindowDimensions from "./useWindowDimensions";

const SortableDiv = styled.div``;

export default function LinhaTempoArtesanal(props: {
  listaElementos: elementoPadrao[];
  setListaElementos: React.Dispatch<React.SetStateAction<elementoPadrao[]>>;
}) {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  // const { width } = useWindowDimensions();
  const corItemSelecionadoFoco = (el) => {
    return mapaContext.elementosFoco
      ? mapaContext.elementosFoco?.some((x) => x.id === el.id)
        ? "#1976d245"
        : ""
      : mapaContext.elementoFoco?.id === el.id
      ? "#1976d245"
      : "";
  };

  const cliqueElementoConteudoLinhaTempo = (
    elemento: elementoPadrao,
    evento: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (evento.ctrlKey)
      dispatch({ type: "adicionarElementoFoco", elemento: elemento });
    else if (evento.shiftKey) {
      const indexClick = props.listaElementos.findIndex(
        (x) => x.id === elemento.id
      );
      const indexAtual = props.listaElementos.findIndex(
        (x) => x.id === mapaContext.elementoFoco?.id
      );
      const novaListaSelecionados =
        indexAtual > indexClick
          ? props.listaElementos.slice(indexClick, indexAtual + 1)
          : props.listaElementos.slice(indexAtual, indexClick + 1);
      dispatch({
        type: "selecionarElementosFoco",
        elementos: novaListaSelecionados,
      });
    } else dispatch({ type: "selecionarElementoFoco", elemento: elemento });
  };

  function SortableItem(p: { elemento: elementoPadrao }) {
    return (
      <>
        <ListItem
          sx={{
            paddingLeft: 0,
            backgroundColor: corItemSelecionadoFoco(p.elemento),
          }}
        >
          <ListItemButton
            sx={{ maxWidth: 155 }}
            onClick={(e) => {
              cliqueElementoConteudoLinhaTempo(p.elemento, e);
            }}
          >
            <ListItemIcon className="handle-sortable">
              <Menu />
            </ListItemIcon>
            <Typography>{p.elemento.nome}</Typography>
          </ListItemButton>
          <ListItemIcon>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => {
                dispatch({
                  type: "removeElement",
                  tipo: p.elemento.dataRef,
                  indiceElemento: mapaContext?.conteudo[
                    p.elemento.dataRef
                  ].findIndex((x) => x.id === p.elemento.id),
                  nomeElemento: p.elemento.nome,
                });
              }}
            >
              <Delete />
            </IconButton>
          </ListItemIcon>
          <Grid
            item
            xs={12}
            sx={{
              height: "100%",
              display: "contents",
              marginLeft: 2,
              "&:before": {
                content: '""',
                position: "absolute",
                height: "100%",
                width: "1px",
                left: 200,
                bgcolor: "#6e7073bf",
              },
            }}
          >
            {/* TODO: Fazer o preenchimento da linha do tempo com cenaInicio e cenaFim  */}
          </Grid>
        </ListItem>

        <Divider />
      </>
    );
  }

  return (
    <ReactSortable
      list={props.listaElementos}
      setList={props.setListaElementos}
      className="personalized-scrollbar"
      handle=".handle-sortable"
      style={{ height: "100%", overflowY: "scroll" }}
      scroll={true}
      direction={"vertical"}
      animation={0}
    >
      {props.listaElementos &&
        props.listaElementos.map((z, il) => {
          return (
            <SortableDiv key={z.id}>
              <SortableItem key={`ListItem#${z.nome}-${il}`} elemento={z} />
            </SortableDiv>
          );
        })}
    </ReactSortable>
  );
}
