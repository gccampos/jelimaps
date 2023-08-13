import React, { useEffect, useState } from "react";
import {
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
//import Image from "next/image";
//import timeline from "public/timeline.png";
import { useMapaContext, useMapaDispatch } from "../Mapa/context/MapaContext";
import { Delete, Menu } from "@mui/icons-material";
import { elementoPadrao } from "../Mapa/context/mapaContextTypes";
import { ReactSortable } from "react-sortablejs";
import styled from "@emotion/styled";

const SortableDiv = styled.div``;

export default function LinhaTempo() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
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
      <ListItem
        sx={{
          paddingLeft: 0,
          backgroundColor: corItemSelecionadoFoco(props.elemento),
        }}
        secondaryAction={
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
        }
      >
        <ListItemButton
          onClick={
            (e) => {
              console.log(e);
              cliqueElementoNoMapa(props.elemento, e);
            }
            //handleCollapsePropriedades(x, il, !z.collapse)
          }
        >
          <ListItemIcon className="handle-sortable">
            <Menu />
            {props.elemento.nome}
          </ListItemIcon>
        </ListItemButton>
        <Divider />
      </ListItem>
    );
  }

  useEffect(() => {
    setListaElementos((lista) => [
      ...lista,
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
