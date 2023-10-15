import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  DataInterfaceDataGroup,
  //DataSet,
  Timeline,
  TimelineEventPropertiesResult,
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
import { v4 } from "uuid";
import moment from "moment";
import { TerraDraw } from "terra-draw";

export default function VisTimeline(props: {
  tempoAtualRef: React.MutableRefObject<any>;
  draw: TerraDraw;
}) {
  const { tempoAtualRef } = props;
  const listaElementos = useListaElementos();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [visTimeline, setVisTimeline] = useState<Timeline>(null);
  const intervaloRef = useRef(null);
  const elementosTimelineRef = useRef(null);
  const dataSetRef = useRef(null);
  const visJsRef = useRef<HTMLDivElement>(null);
  const divScrollRef = useRef<HTMLDivElement>(null);
  const elementos = useRef(
    useListaElementos().filter((x) => x.visTimelineObject?.type != "background")
  );
  elementos.current = useListaElementos().filter(
    (x) => x.visTimelineObject?.type != "background"
  );

  const listaMapeada = useCallback(
    (lista?: (tipoElemento | tipoGenericoElementoTimeline)[]) => {
      return (lista ?? listaElementos).map((x) => {
        return {
          ...x,
          type: x.visTimelineObject?.type ?? null,
          group: !x.visTimelineObject?.type
            ? x.id
            : x.visTimelineObject.type === "box"
            ? x.group
            : null,
          content: x.nome,
          start: x.cenaInicio,
          end: x.cenaFim,
        };
      });
    },
    [listaElementos]
  );
  const listaMapeadaElementos = useMemo(() => {
    const valorItems = listaMapeada().filter(
      (x) => x.visTimelineObject?.type != "background"
    );
    return valorItems;
  }, [listaMapeada]);

  const listaMapeadaPropriedades = useMemo(() => {
    return listaMapeada(
      listaMapeada()
        .map((x) => {
          return (
            (x as any).alteracoes &&
            (x as any).alteracoes.map((z) => {
              return z ? { ...z, group: x.id } : null;
            })
          );
        })
        .flat()
        .filter((x) => x)
    );
  }, [listaMapeada]);

  const elementosAlteracoesTimeline = useMemo(() => {
    const valorItems = listaMapeada().concat(listaMapeadaPropriedades);
    return valorItems;
  }, [listaMapeada, listaMapeadaPropriedades]);

  const elementosFocados = useMemo(() => {
    if (mapaContext.elementosFoco && mapaContext.elementosFoco.length > 0)
      return mapaContext.elementosFoco.map((x) => x.id);
    if (mapaContext.elementoFoco) return mapaContext.elementoFoco.id;
  }, [mapaContext.elementosFoco, mapaContext.elementoFoco]);

  const setElementosSelecionados = useCallback(() => {
    if (visTimeline) visTimeline.setSelection(elementosFocados);
  }, [visTimeline, elementosFocados]);

  const handleSeleciona = useCallback(
    (item: any) => {
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
      // draw.removeFeatures([item.id.toString()]);
      dispatch({
        type: "removeElements",
        id: item.id,
        group: item.group,
      });
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

  const handleDoubleClick = useCallback(
    (e: TimelineEventPropertiesResult) => {
      if (e.group)
        dispatch({
          ...e,
          start: e.snappedTime,
          id: v4(),
          type: "adicionarAlteracaoElemento",
        });
    },
    [dispatch]
  );
  const handleClick = useCallback(
    (item: TimelineEventPropertiesResult) => {
      console.log("click", item.what);
      if (!item.what) {
        dispatch({
          type: "alteraPropriedadeGeral",
          tipo: "fit",
          valor: true,
        });
      }
      if (item.what === "axis") {
        dispatch({ ...item, type: "atualizaTempo" });
        tempoAtualRef.current = item.time;
      }
      if (item.what === "group-label")
        dispatch({
          type: "selecionarElementosFocoPorId",
          ids: [item.group],
        });
    },
    [dispatch, tempoAtualRef]
  );
  const handleOnMoving = useCallback(
    (item: TimelineItem, cb: any) => {
      const elemento: tipoElemento = {
        ...({
          ...item,
          cenaInicio: item.start,
          cenaFim: item.end,
          nome: "",
        } as unknown as elementoPadrao),
        visTimelineObject: { type: "box" },
        bounds: null,
      };
      const dentroDoRangeCenas =
        new Date(mapaContext.conteudo.cenas[0].cenaInicio) <
          new Date(item.start) &&
        new Date(
          mapaContext.conteudo.cenas[
            mapaContext.conteudo.cenas.length - 1
          ].cenaFim
        ) > new Date(item.end);
      if (dentroDoRangeCenas)
        if (elemento.group === elemento.id) {
          if (
            !elemento.alteracoes ||
            elemento.alteracoes.every(
              (x) =>
                new Date(x.cenaInicio) > new Date(item.start) &&
                new Date(x.cenaFim) < new Date(item.end)
            )
          )
            cb(item);
        } else {
          const _listaElementos = elementosTimelineRef.current?.groups;
          const elementoPrincipal = _listaElementos.find(
            (x) => x.id === item.group
          );
          if (
            !!elementoPrincipal &&
            new Date(elementoPrincipal.cenaInicio) <
              new Date(elemento.cenaInicio) &&
            new Date(elementoPrincipal.cenaFim) > new Date(elemento.cenaFim)
          ) {
            cb(elemento);
          }
        }
    },
    [mapaContext]
  );
  const handleAlterandoOrdem = useCallback(
    (from: any, to: any, groups: DataInterfaceDataGroup) => {
      const targetOrder = to.order;
      to.order = from.order;
      from.order = targetOrder;
      if (
        //!intervaloRef.current &&
        JSON.stringify(dataSetRef.current) !==
        JSON.stringify([to.order, from.order].sort((a, b) => a.order - b.order))
      ) {
        intervaloRef.current = setTimeout(() => {
          groups.forEach((x: any) => {
            if (elementos.current.find((z) => z.id === x.id)?.order !== x.order)
              dispatch({
                type: "editarPropriedade",
                tipo: x.dataRef,
                id: x.id,
                nomePropriedade: "order",
                valorPropriedade: x.order,
              });
          });
          intervaloRef.current = null;
        }, 0);
        dataSetRef.current = [to.order, from.order].sort(
          (a, b) => a.order - b.order
        );
      }
    },
    [dispatch]
  );

  const optionsVisTimeline = useMemo<TimelineOptions>(() => {
    return {
      ...mapaContext.timelineOptions,
      onRemove: handleRemoveConteudo,
      onMove: handleAtualizaConteudo,
      onMoving: handleOnMoving,
      groupOrderSwap: handleAlterandoOrdem,
    };
  }, [
    mapaContext,
    handleOnMoving,
    handleAlterandoOrdem,
    handleRemoveConteudo,
    handleAtualizaConteudo,
    //handleAdicionarPropriedadeConteudo,
  ]);
  useEffect(() => {
    if (!visTimeline) {
      const tl =
        visJsRef.current &&
        new Timeline(visJsRef.current, null, optionsVisTimeline);
      tl.addCustomTime(optionsVisTimeline.start, "currentTime");
      tempoAtualRef.current = moment(optionsVisTimeline.start)
        .add(1, "seconds")
        .format("yyyy-MM-DDTHH:mm:ss");
      setVisTimeline(tl);
      tl.on("select", handleSeleciona);
      tl.on("click", handleClick);
      tl.on("doubleClick", handleDoubleClick);
      tl.on("timechanged", (e) => {
        dispatch({ type: "atualizaTempo", time: e.time });
        tempoAtualRef.current = e.time;
      });
    }
  }, [
    visJsRef,
    visTimeline,
    tempoAtualRef,
    optionsVisTimeline,
    dispatch,
    handleClick,
    listaMapeada,
    setVisTimeline,
    handleSeleciona,
    handleDoubleClick,
  ]);

  const setOptionsTimeline = useCallback(() => {
    if (mapaContext.playStatus === 0)
      dispatch({
        type: "alteraPropriedadeGeral",
        tipo: "playStatus",
        valor: -1,
      });
    if (mapaContext.reloadTimelineOptions)
      visTimeline.setOptions(mapaContext.timelineOptions);
    if (mapaContext.fit) {
      visTimeline.fit();
      dispatch({
        type: "alteraPropriedadeGeral",
        tipo: "fit",
        valor: false,
      });
    }
  }, [dispatch, mapaContext, visTimeline]);

  useEffect(() => {
    const atual = {
      groups: listaMapeadaElementos,
      items: elementosAlteracoesTimeline,
    };
    const temDiferencaConteudo =
      elementosTimelineRef.current?.groups?.length !== atual.groups.length ||
      elementosTimelineRef.current?.items?.length !== atual.items.length;

    console.log("edasdas", atual);
    if (visTimeline && temDiferencaConteudo) visTimeline.setData(atual);

    setElementosSelecionados();
    elementosTimelineRef.current = atual;
  }, [
    visTimeline,
    listaMapeadaElementos,
    elementosAlteracoesTimeline,
    setElementosSelecionados,
  ]);

  useEffect(() => {
    if (visTimeline)
      visTimeline.setCustomTime(mapaContext.tempo, "currentTime");
  }, [visTimeline, mapaContext.tempo]);

  useEffect(() => {
    if (visTimeline) {
      const scrollTopValue = divScrollRef.current.scrollTop;
      setOptionsTimeline();
      if (scrollTopValue)
        setTimeout(() => {
          console.log("vai ajustar scroll do visTimeline", scrollTopValue);
          divScrollRef.current.scrollTop = scrollTopValue;
        }, 77);
    }
  }, [visTimeline, setOptionsTimeline]);

  useEffect(setElementosSelecionados, [
    visTimeline,
    elementosFocados,
    setElementosSelecionados,
  ]);

  return (
    <div
      ref={divScrollRef}
      className="personalized-scrollbar"
      style={{ overflowY: "scroll", height: "-webkit-fill-available" }}
    >
      <div ref={visJsRef} />
    </div>
  );
}
