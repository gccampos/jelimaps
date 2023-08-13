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

  const cliqueElementoNoMapa = (elemento, evento) => {
    if (evento.shiftKey)
      dispatch({ type: "adicionarElementoFoco", elemento: elemento });
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
              console.log(e);
              cliqueElementoNoMapa(props.elemento, e);
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
                  indiceElemento: props.numero,
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
                <SortableItem
                  key={`ListItem#${z.nome}-${il}`}
                  elemento={z}
                  numero={il}
                />
              </SortableDiv>
            );
          })}
      </ReactSortable>
    </Grid>
  );
}
