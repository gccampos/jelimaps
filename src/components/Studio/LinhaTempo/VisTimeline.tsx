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
      return (lista ?? listaElementos).map((x) => {
        return {
          ...x,
          group: !x.type ? x.id : null,
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
      if (item.event.srcEvent.type === 'pointerup' ||
        item.event.srcEvent.type === 'pointerdown')
        dispatch({
          type: "selecionarElementosFocoPorId",
          ids: item.items,
        });
      else {
        item.event.preventDefault()
      }
    },
    [dispatch]
  );

  const handleRemoveConteudo = useCallback(
    (item: TimelineItem) => {
      const dispOpt = {
        type: "removeElements",
        id: item.id
      }
      dispatch(dispOpt);
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
      autoResize: true,
      selectable: true,
      onRemove: handleRemoveConteudo,
      onMove: handleAtualizaConteudo,
      multiselect: true,
      orientation: 'top',
      longSelectPressTime: 777,
      snap: (date) => date
    };
  }, [mapaContext, handleRemoveConteudo, handleAtualizaConteudo]);
  useEffect(() => {
    if (!visTimeline) {
      console.log('vai configurar o vis timeline')
      const items = listaMapeada();
      const tl =
        visJsRef.current &&
        new Timeline(visJsRef.current, items, optionsVisTimeline);
      tl.on('select', handleSeleciona)
      setVisTimeline(tl);
    }
  }, [visJsRef, visTimeline, listaMapeada, optionsVisTimeline, handleSeleciona]);
  useEffect(() => {
    if (visTimeline) {
      const scrollTopValue = visJsRef.current.scrollTop
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
          .filter((x) => x).concat([
            {
              valor: 1, tipo: '', nome: 's', id: v4(), group: v4(), cenaFim: '2023-08-20', cenaInicio: '2023-08-18',
              form: null, type: 'background', style: "background-color: red;"
            }])
      );

      console.log('listaPropriedades', listaPropriedades)
      const valorItems = listaMapeada().concat(listaPropriedades)
      console.log('valorItems CONCATENADOS', valorItems)
      visTimeline.setData({
        groups: listaMapeada(),
        items: valorItems,
      });
      //visTimeline.setSelection(elementosFocados)
      setTimeout(() => {
        visJsRef.current.scrollTop = scrollTopValue
      }, 10)

    }
  }, [visTimeline, listaMapeada, elementosFocados]);
  return (
    <div
      ref={visJsRef}
      className="personalized-scrollbar"
      style={{ overflowY: "scroll", height: "-webkit-fill-available" }}
    />
  );
}
