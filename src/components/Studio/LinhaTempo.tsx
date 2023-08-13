import React, { useEffect, useState } from "react";
import {
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { useMapaContext, useMapaDispatch } from "../Mapa/context/MapaContext";
import { Delete, Menu } from "@mui/icons-material";
import { elementoPadrao } from "../Mapa/context/mapaContextTypes";
import { ReactSortable } from "react-sortablejs";
import styled from "@emotion/styled";
// import useWindowDimensions from "./useWindowDimensions";

const SortableDiv = styled.div``;

export default function LinhaTempo() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  // const { width } = useWindowDimensions();
  const [listaElementos, setListaElementos] = useState<elementoPadrao[]>(
    Object.keys(mapaContext?.conteudo)
      .map((x) => mapaContext?.conteudo[x])
      .flat()
  );

  const cliqueElementoConteudoLinhaTempo = (
    elemento: elementoPadrao,
    evento: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const indexClick = listaElementos.findIndex((x) => x.id === elemento.id);
    const indexAtual = listaElementos.findIndex(
      (x) => x.id === mapaContext.elementoFoco?.id
    );
    const novaListaSelecionados =
      indexAtual > indexClick
        ? listaElementos.slice(indexClick, indexAtual + 1)
        : listaElementos.slice(indexAtual, indexClick + 1);
    if (evento.ctrlKey)
      dispatch({ type: "adicionarElementoFoco", elemento: elemento });
    else if (evento.shiftKey)
      dispatch({
        type: "selecionarElementosFoco",
        elementos: novaListaSelecionados,
      });
    else dispatch({ type: "selecionarElementoFoco", elemento: elemento });
  };

  const corItemSelecionadoFoco = (el) => {
    return mapaContext.elementoFoco?.id === el.id ||
      mapaContext.elementosFoco?.some((x) => x.id === el.id)
      ? "#1976d245"
      : "";
  };

  function SortableItem(props) {
    return (
      <>
        <ListItem
          sx={{
            paddingLeft: 0,
            backgroundColor: corItemSelecionadoFoco(props.elemento),
          }}
        >
          <ListItemButton
            sx={{ maxWidth: 155 }}
            onClick={(e) => {
              cliqueElementoConteudoLinhaTempo(props.elemento, e);
            }}
          >
            <ListItemIcon className="handle-sortable">
              <Menu />
            </ListItemIcon>
            <Typography>{props.elemento.nome}</Typography>
          </ListItemButton>
          <ListItemIcon>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => {
                dispatch({
                  type: "removeElement",
                  tipo: props.elemento.dataRef,
                  indiceElemento: mapaContext?.conteudo[
                    props.elemento.dataRef
                  ].findIndex((x) => x.id === props.elemento.id),
                  nomeElemento: props.elemento.nome,
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
            <Typography>oi</Typography>
          </Grid>
        </ListItem>

        <Divider />
      </>
    );
  }

  useEffect(() => {
    setListaElementos((lista) => [
      ...lista.filter((x) =>
        mapaContext?.conteudo[x.dataRef].some((z) => z.id === x.id)
      ),
      ...Object.keys(mapaContext?.conteudo)
        .map((x) => mapaContext?.conteudo[x])
        .flat()
        .filter((x) => !lista.some((z) => z.id === x.id)),
    ]);
  }, [mapaContext, mapaContext.conteudo]);
  return (
    <Grid
      id={"oi"}
      item
      xs={12}
      sx={{
        height: "100%",
        ".react-sortable-personalized-scrollbar": {
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: 7,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            outline: `1px solid slategrey`,
          },
        },
      }}
    >
      <ReactSortable
        list={listaElementos}
        setList={setListaElementos}
        className="react-sortable-personalized-scrollbar"
        handle=".handle-sortable"
        style={{ height: "100%", overflowY: "scroll" }}
        scroll={true}
        direction={"vertical"}
        animation={0}
      >
        {listaElementos &&
          listaElementos.map((z, il) => {
            return (
              <SortableDiv key={z.id}>
                <SortableItem key={`ListItem#${z.nome}-${il}`} elemento={z} />
              </SortableDiv>
            );
          })}
      </ReactSortable>
    </Grid>
  );
}
