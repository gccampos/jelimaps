import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Timeline,
  TimelineItem,
  TimelineOptions,
} from "vis-timeline/standalone";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import {
  tipoElemento,
  tipoGenericoElementoTimeline,
} from "@/components/Mapa/context/mapaContextTypes";
import useListaElementos from "./useListaElementos";
import { v4 } from "uuid";

export default function VisTimeline() {
  const listaElementos = useListaElementos();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [visTimeline, setVisTimeline] = useState<Timeline>(null);
  const visJsRef = useRef<HTMLDivElement>(null);

  const listaMapeada = useCallback(
    (lista?: (tipoElemento | tipoGenericoElementoTimeline)[]) => {
      if (lista) console.log("listaMapeada a partir de ", lista);
      return (lista ?? listaElementos).map((x) => {
        return {
          ...x,
          group: !x.type ? x.id : x.type === "box" ? x.group : null,
          content: x.nome,
          start: x.cenaInicio,
          end: x.cenaFim,
        };
      });
    },
    [listaElementos]
  );

  const handleSeleciona = useCallback(
    (item: any) => {
      console.log("select", item);
      if (
        item.event.srcEvent.type === "pointerup" ||
        item.event.srcEvent.type === "pointerdown"
      )
        dispatch({
          type: "selecionarElementosFocoPorId",
          ids: item.items,
        });
      else {
        item.event.preventDefault();
      }
    },
    [dispatch]
  );

  const handleRemoveConteudo = useCallback(
    (item: TimelineItem) => {
      const dispOpt = {
        type: "removeElements",
        id: item.id,
      };
      dispatch(dispOpt);
    },
    [dispatch]
  );
  const handleAtualizaConteudo = useCallback(
    (item: TimelineItem) => {
      dispatch({
        ...item,
        type: "updateTimelineElement",
      });
    },
    [dispatch]
  );
  const handleAdicionarPropriedadeConteudo = useCallback(
    (item: TimelineItem) => {
      console.log("handleAdicionarPropriedadeConteudo", item);

      dispatch({
        ...item,
        type: "adicionarAlteracaoElemento",
      });
    },
    [dispatch]
  );

  const elementosFocados = useMemo(() => {
    if (mapaContext.elementosFoco && mapaContext.elementosFoco.length > 0)
      return mapaContext.elementosFoco.map((x) => x.id);
    if (mapaContext.elementoFoco) return mapaContext.elementoFoco.id;
  }, [mapaContext]);
  const optionsVisTimeline = useMemo<TimelineOptions>(() => {
    return {
      editable: { remove: true, updateTime: true },
      zoomKey: "ctrlKey",
      start: mapaContext.cenaInicio,
      end: mapaContext.cenaFim,
      autoResize: true,
      selectable: true,
      groupHeightMode: "fixed",
      onRemove: handleRemoveConteudo,
      onMove: handleAtualizaConteudo,
      onMoving: (item: TimelineItem, cb: any) => {
        const elemento: tipoElemento = {
          ...item,
          bounds: null,
          cenaInicio: item.start,
          cenaFim: item.end,
          nome: "",
        };
        const dentroDoRangeCenas =
          new Date(mapaContext.cenas[0].cenaInicio) < new Date(item.start) &&
          new Date(mapaContext.cenas[mapaContext.cenas.length - 1].cenaFim) >
            new Date(item.end);
        console.log("dentroDoRangeCenas, ", dentroDoRangeCenas);
        if (dentroDoRangeCenas)
          if (elemento.alteracoes) {
            if (
              elemento.alteracoes.every(
                (x) =>
                  new Date(x.cenaInicio) > new Date(item.start) &&
                  new Date(x.cenaInicio) < new Date(item.end)
              )
            )
              cb(item);
          } else cb(item);
      },
      multiselect: true,
      orientation: "top",
      longSelectPressTime: 777,
      snap: (date) => date,
      rollingMode: { offset: 0, follow: false },
      showCurrentTime: false,
    };
  }, [
    mapaContext,
    handleRemoveConteudo,
    handleAtualizaConteudo,
    //handleAdicionarPropriedadeConteudo,
  ]);
  useEffect(() => {
    if (!visTimeline) {
      console.log("vai configurar o vis timeline");
      const items = listaMapeada();
      const tl =
        visJsRef.current &&
        new Timeline(visJsRef.current, items, optionsVisTimeline);
      tl.on("select", handleSeleciona);
      tl.addCustomTime(optionsVisTimeline.start, "currentTime");
      tl.on("doubleClick", (e: any) => {
        console.log("clique DUPLO", e);
        if (e.group)
          handleAdicionarPropriedadeConteudo({
            ...e,
            start: e.snappedTime,
            content: "",
            id: v4(),
          });
      });
      tl.on("click", (e: any) => {
        console.log("clicando", e);
        //if (e.snappedTime) tl.setCustomTime(e.snappedTime, "currentTime");
      });
      setVisTimeline(tl);
    }
  }, [
    visJsRef,
    visTimeline,
    listaMapeada,
    optionsVisTimeline,
    handleSeleciona,
    handleAdicionarPropriedadeConteudo,
  ]);
  useEffect(() => {
    if (visTimeline) {
      const scrollTopValue = visJsRef.current.scrollTop;
      const listaPropriedades = listaMapeada(
        listaMapeada()
          .map((x) => {
            return (
              (x as tipoElemento).alteracoes &&
              (x as tipoElemento).alteracoes.map((z) => {
                return z ? { ...z, group: x.id } : null;
              })
            );
          })
          .flat()
          .filter((x) => x)
          .concat(
            mapaContext.cenas.map((x) => {
              return {
                ...x,
                valor: 1,
                tipo: "",
                group: v4(),
                form: null,
                type: "background",
                style: "background-color: #df000024;",
              };
            })
          )
      );

      console.log("listaPropriedades", listaPropriedades);
      console.log("listaMapeada()", listaMapeada());
      const valorItems = listaMapeada().concat(listaPropriedades);
      console.log("valorItems CONCATENADOS", valorItems);
      console.log(
        "visTimeline.getVisibleItems()(FILTRADO)",
        visTimeline
          .getVisibleItems()
          .filter((x) => !valorItems.some((z) => z.id === x))
      );
      visTimeline.setData({
        groups: listaMapeada(),
        items: valorItems,
      });
      visTimeline.setSelection(elementosFocados);
      if (scrollTopValue)
        setTimeout(() => {
          console.log("mudando scrool", scrollTopValue);
          visJsRef.current.scrollTop = scrollTopValue;
        }, 10);
    }
  }, [visTimeline, listaMapeada, elementosFocados, mapaContext]);
  return (
    <div
      ref={visJsRef}
      className="personalized-scrollbar"
      style={{ overflowY: "scroll", height: "-webkit-fill-available" }}
    />
  );
}
