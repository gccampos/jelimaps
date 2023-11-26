import React, { useEffect, useRef, useState } from "react";
import Propriedades from "./Propriedades";
import LinhaTempo from "./LinhaTempo/Index";
import { Grid, styled } from "@mui/material";
import Mapa from "./MapaAdapter";
import { Rnd } from "react-rnd";
import useWindowDimensions from "./useWindowDimensions";
import { ElementosLateral } from "./Elementos";
import L from "leaflet";
import { TerraDraw } from "terra-draw";
import { useMapaContext, useMapaDispatch } from "../Mapa/MapaContext";
import { tipoElemento } from "../Mapa/mapaContextTypes";
import MapaContextChanger from "../Mapa/ContextChangers";
import terraDrawSetup from "./terraDrawSetup";
// import moment from "moment";

const Dragger = styled("div")`
  cursor: n-resize;
`;

// Define a função para inserir um texto no clipboard
function copyToClipboard(text) {
  // Cria um elemento textarea temporário
  const textarea = document.createElement("textarea");
  // Define o valor do textarea como o texto
  textarea.value = text;
  // Adiciona o textarea ao documento
  document.body.appendChild(textarea);
  // Seleciona o texto do textarea
  textarea.select();
  // Executa o comando de copiar
  document.execCommand("copy");
  // Remove o textarea do documento
  document.body.removeChild(textarea);
}

const Studio = () => {
  const { height } = useWindowDimensions();
  const [rndRef, setRndRef] = useState<Rnd>();
  const [map, setMap] = useState<L.Map>();
  const conteudoElementosRef = useRef<tipoElemento[]>(null);
  const mapaContext = useMapaContext();
  const tempoAtualRef = useRef(null);
  const elementosSelecionadosRef = useRef(null);
  const [draw, setDraw] = useState<TerraDraw>(null);
  const [altura, setAltura] = useState(height * 0.25);
  const displaYNoneStyle = { display: "none" };
  const [larguraPropriedades, setLargurasPropriedades] = useState(250);
  const dispatch = useMapaDispatch();

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 67) {
      if (elementosSelecionadosRef.current.length === 1) {
        const text = JSON.stringify(
          MapaContextChanger.retornaListaElementosConteudo(mapaContext).find(
            (x) => x.id === elementosSelecionadosRef.current[0]
          )
        );
        copyToClipboard(text);
      }
    }
    if (event.ctrlKey && event.keyCode === 86) {
      navigator.clipboard.readText().then((x) => {
        console.log("texto copiado", x);
        // TODO: Realizar inserção de novo elemento de acordo com o JSON do texto copiado
      });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (mapaContext.elementosFoco && mapaContext.elementosFoco.length > 0)
      elementosSelecionadosRef.current = mapaContext.elementosFoco.map(
        (x) => x.id
      );
    else if (mapaContext.elementoFoco)
      elementosSelecionadosRef.current = [mapaContext.elementoFoco.id];
    else elementosSelecionadosRef.current = null;
  }, [mapaContext.elementosFoco, mapaContext.elementoFoco]);

  const pegarConteudoElementos = () => conteudoElementosRef.current;
  const alterarEventTimeoutConteudoElemento = (
    index: number,
    eventTimeout?: any
  ) => (conteudoElementosRef.current[index].eventTimeout = eventTimeout);
  const pegarElementosSelecionados = () => elementosSelecionadosRef.current;
  const eventRef = useRef<boolean>();
  const pegarEventRef = () => eventRef.current;
  const alterarEventRef = (value: boolean) => (eventRef.current = value);

  useEffect(() => {
    if (map && !draw)
      setDraw(
        terraDrawSetup(
          dispatch,
          map,
          pegarConteudoElementos,
          alterarEventTimeoutConteudoElemento,
          pegarElementosSelecionados,
          pegarEventRef,
          alterarEventRef
        )
      );
  }, [dispatch, draw, map]);

  useEffect(() => {
    if (draw)
      if (!elementosSelecionadosRef.current) {
        (draw as any)._modes.select.deselect();
      } else {
        if (elementosSelecionadosRef.current.length == 1)
          (draw as any)._modes.select.selected =
            elementosSelecionadosRef.current;
      }
  }, [
    draw,
    mapaContext.conteudo,
    mapaContext.elementoFoco,
    mapaContext.elementosFoco,
  ]);

  return (
    <Grid container sx={{ height: "100%" }} id="studioMapa">
      <Grid item container xs={12}>
        <ElementosLateral altura={height - altura} draw={draw} />
        <Mapa
          altura={height - altura}
          setMapa={setMap}
          draw={draw}
          conteudoElementosRef={conteudoElementosRef}
        />
        <Propriedades
          altura={height - altura}
          tempoAtualRef={tempoAtualRef}
          larguraPropriedades={larguraPropriedades}
          setLargurasPropriedades={setLargurasPropriedades}
        />
      </Grid>
      <Rnd
        ref={(c) => {
          setRndRef(c);
        }}
        maxHeight={height * 0.9}
        minHeight={height * 0.05}
        resizeHandleStyles={{
          bottom: displaYNoneStyle,
          left: displaYNoneStyle,
          right: displaYNoneStyle,
          topLeft: displaYNoneStyle,
          topRight: displaYNoneStyle,
          bottomLeft: displaYNoneStyle,
          bottomRight: displaYNoneStyle,
          top: { height: 25 },
        }}
        size={{ height: altura, width: "100%" }}
        disableDragging
        position={{ y: height - altura, x: 0 }}
        resizeHandleComponent={{
          top: (
            <Dragger
              sx={{
                borderStyle: "outset",
                borderBottom: 2,
                height: 20,
                backgroundColor: "#e2e2e2",
                marginTop: 0.6,
              }}
            ></Dragger>
          ),
        }}
        onResize={(e, dir, ref) => {
          if (rndRef && rndRef.updatePosition)
            rndRef?.updatePosition({ x: 0, y: height - ref.offsetHeight });
          setAltura(ref.offsetHeight);
        }}
      >
        <Grid
          item
          container
          xs={12}
          mt={2.2}
          sx={{ height: "95%", maxHeight: altura }}
        >
          <LinhaTempo tempoAtualRef={tempoAtualRef} altura={altura} />
        </Grid>
      </Rnd>
    </Grid>
  );
};

export default Studio;
