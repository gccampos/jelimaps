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
  elementoPadrao,
  tipoElemento,
  tipoGenericoElementoTimeline,
} from "@/components/Mapa/context/mapaContextTypes";
import useListaElementos from "./useListaElementos";

export default function VisTimeline() {
  const listaElementos = useListaElementos();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [visTimeline, setVisTimeline] = useState<Timeline>(null);
  const visJsRef = useRef<HTMLDivElement>(null);

  const listaMapeada = useCallback(
    (lista?: (tipoElemento | tipoGenericoElementoTimeline)[]) => {
      return (lista ?? listaElementos).map((x) => {
        return {
          ...x,
          group: x.id,
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
      dispatch({
        type: "selecionarElementosFoco",
        elementos: Object.keys(mapaContext?.conteudo)
          .map((x) => mapaContext?.conteudo[x])
          .flat().filter(x => item.items.some((z: any) => z === x.id)),
      });
    },
    [dispatch, mapaContext]
  );

  const handleRemoveConteudo = useCallback(
    (item: TimelineItem) => {
      dispatch({
        type: "removeElement",
        id: item.id,
      });
    },
    [dispatch]
  );
  const handleAtualizaConteudo = useCallback(
    (item: TimelineItem) => {
      dispatch({
        type: "updateTimelineElement",
        ...item,
      });
    },
    [dispatch]
  );

  const elementosFocados = useMemo(() => {
    if (mapaContext.elementosFoco && mapaContext.elementosFoco.length > 0)
      return mapaContext.elementosFoco.map(x => x.id)
    if (mapaContext.elementoFoco)
      return mapaContext.elementoFoco.id
  }, [mapaContext])
  const optionsVisTimeline = useMemo<TimelineOptions>(() => {
    return {
      editable: { remove: true, updateTime: true },
      groupEditable: true,
      zoomKey: "ctrlKey",
      start: mapaContext.cenaInicio,
      end: mapaContext.cenaFim,
      autoResize: false,
      selectable: true,
      onRemove: handleRemoveConteudo,
      onMove: handleAtualizaConteudo,
      multiselect: true,
      orientation: 'top',
    };
  }, [mapaContext, handleRemoveConteudo, handleAtualizaConteudo]);
  useEffect(() => {
    if (!visTimeline) {
      const items = listaMapeada();
      const tl =
        visJsRef.current &&
        new Timeline(visJsRef.current, items, optionsVisTimeline);
      tl.on('select', handleSeleciona)
      setVisTimeline(tl);
    }
  }, [visJsRef, visTimeline, listaMapeada, optionsVisTimeline]);
  useEffect(() => {
    if (visTimeline) {
      const listaPropriedades = listaMapeada(
        listaMapeada()
          .map((x) => {
            return (
              (x as tipoElemento).propriedades &&
              (x as tipoElemento).propriedades.map((z) => {
                return z ? { ...z, group: x.id } : null;
              })
            );
          })
          .flat()
          .filter((x) => x)
      );
      visTimeline.setData({
        groups: listaMapeada(),
        items: listaMapeada().concat(listaPropriedades),
      });
      visTimeline.setSelection(elementosFocados)
    }
  }, [visTimeline, listaMapeada]);
  return (
    <div
      ref={visJsRef}
      className="personalized-scrollbar"
      style={{ overflowY: "scroll", height: "-webkit-fill-available" }}
    />
  );
}
