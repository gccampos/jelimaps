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
  tipoElemento,
  tipoGenericoElementoTimeline,
} from "@/components/Mapa/context/mapaContextTypes";
import useListaElementos from "./useListaElementos";
import { v4 } from "uuid";
// import moment from "moment";

export default function VisTimeline() {
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
    useListaElementos().filter((x) => x.type != "background")
  );
  elementos.current = useListaElementos().filter((x) => x.type != "background");

  const listaMapeada = useCallback(
    (lista?: (tipoElemento | tipoGenericoElementoTimeline)[]) => {
      console.log(
        "vai rodar o metodo da lista mapeada",
        lista ?? listaElementos
      );
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
  const listaMapeadaElementos = useMemo(() => {
    const valorItems = listaMapeada().filter((x) => x.type != "background");
    console.log("todos elementos", valorItems);
    return valorItems;
  }, [listaMapeada]);

  const listaMapeadaPropriedades = useMemo(() => {
    return listaMapeada(
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
    );
  }, [listaMapeada]);

  const elementosAlteracoesTimeline = useMemo(() => {
    const valorItems = listaMapeada().concat(listaMapeadaPropriedades);
    console.log("todos elementos e alterações", valorItems);
    return valorItems;
  }, [listaMapeada, listaMapeadaPropriedades]);

  const elementosFocados = useMemo(() => {
    if (mapaContext.elementosFoco && mapaContext.elementosFoco.length > 0)
      return mapaContext.elementosFoco.map((x) => x.id);
    if (mapaContext.elementoFoco) return mapaContext.elementoFoco.id;
  }, [mapaContext.elementosFoco, mapaContext.elementoFoco]);

  const setElementosSelecionados = useCallback(() => {
    console.log("Callback do elementosFocados", elementosFocados);
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
      dispatch({
        ...item,
        type: "adicionarAlteracaoElemento",
      });
    },
    [dispatch]
  );
  const handleDoubleClick = useCallback(
    (e: TimelineEventPropertiesResult) => {
      if (e.group)
        handleAdicionarPropriedadeConteudo({
          ...e,
          start: e.snappedTime,
          content: "",
          id: v4(),
        });
    },
    [handleAdicionarPropriedadeConteudo]
  );
  const handleClick = useCallback(
    (item: TimelineEventPropertiesResult) => {
      console.log("click", item, visTimeline);
      if (!item.what)
        dispatch({
          type: "alteraPropriedadeGeral",
          tipo: "fit",
          valor: true,
        });
      if (item.what === "axis") dispatch({ ...item, type: "atualizaTempo" });
      if (item.what === "group-label")
        dispatch({
          type: "selecionarElementosFocoPorId",
          ids: [item.group],
        });
    },
    [dispatch, visTimeline]
  );
  const handleOnMoving = useCallback(
    (item: TimelineItem, cb: any) => {
      const elemento: tipoElemento = {
        ...item,
        bounds: null,
        cenaInicio: item.start,
        cenaFim: item.end,
        nome: "",
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
          const listaElementos = Object.keys(mapaContext?.conteudo)
            .map((x) => mapaContext?.conteudo[x])
            .flat();

          const elementoPrincipal = listaElementos.find(
            (x) => x.id === item.group
          );
          if (
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
      dataSetRef.current = groups;
      if (!intervaloRef.current) {
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
        }, 7000);
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
      setVisTimeline(tl);
      tl.on("select", handleSeleciona);
      tl.on("click", handleClick);
      tl.on("doubleClick", handleDoubleClick);
      tl.on("timechanged", (e) => {
        dispatch({ type: "atualizaTempo", time: e.time });
      });
    }
  }, [
    visJsRef,
    visTimeline,
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
    console.log("verificando JSON", dataSetRef.current);
    atual.groups.forEach((x) =>
      dataSetRef.current
        ?.map((x) => x)
        .forEach((z) => {
          if (x.id === z.id)
            console.log(
              "verificando JSON => dataSetRef.current",
              JSON.stringify(x) === JSON.stringify(z),
              "\nvalor atual\n",
              JSON.stringify(x),
              "\nvalor dataSet\n",
              JSON.stringify(z)
            );
        })
    );
    atual.groups.forEach((x) =>
      elementosTimelineRef.current?.groups.forEach((z) => {
        if (x.id === z.id)
          console.log(
            "verificando JSON => elementosTimelineRef.current",
            JSON.stringify(x) === JSON.stringify(z),
            "\nvalor atual\n",
            JSON.stringify(x),
            "\nvalor elementosTimelineRef\n",
            JSON.stringify(z)
          );
      })
    );
    if (visTimeline && elementosTimelineRef.current !== atual) {
      console.log("useEffect do setData", elementosTimelineRef.current, atual);
      visTimeline.setData({
        groups: listaMapeadaElementos,
        items: elementosAlteracoesTimeline,
      });
      setElementosSelecionados();
    }
    elementosTimelineRef.current = atual;
  }, [
    visTimeline,
    listaMapeadaElementos,
    elementosAlteracoesTimeline,
    setElementosSelecionados,
  ]);

  useEffect(() => {
    console.log("useEffect do setCustomTime");
    if (visTimeline)
      visTimeline.setCustomTime(mapaContext.tempo, "currentTime");
  }, [visTimeline, mapaContext.tempo]);

  useEffect(() => {
    console.log("useEffect COMPLETO");
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
