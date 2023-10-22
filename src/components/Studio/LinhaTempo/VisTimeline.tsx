import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
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
import { v4 } from "uuid";
import moment from "moment";
import { Dialog, IconButton, Stack } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function VisTimeline(props: {
  tempoAtualRef: React.MutableRefObject<any>;
  altura: number;
}) {
  const { tempoAtualRef, altura } = props;
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [visTimeline, setVisTimeline] = useState<Timeline>(null);
  // const intervaloRef = useRef(null);
  const elementosTimelineRef = useRef(null);
  // const dataSetRef = useRef(null);
  const visJsRef = useRef<HTMLDivElement>(null);
  const divScrollRef = useRef(0);
  // const elementos = useRef(
  //   useListaElementos().filter((x) => x.visTimelineObject?.type != "background")
  // );
  // elementos.current = useListaElementos().filter(
  //   (x) => x.visTimelineObject?.type != "background"
  // );

  const listaMapeada = useCallback(
    (lista?: (tipoElemento | tipoGenericoElementoTimeline)[]) => {
      return (
        lista ??
        Object.keys(mapaContext?.conteudo)
          .map((x) => mapaContext?.conteudo[x])
          .flat()
      ).map((x) => {
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
    [mapaContext.conteudo]
  );

  const listaMapeadaPropriedades = useCallback(() => {
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

  const elementosAlteracoesTimeline = useCallback(() => {
    const valorItems = listaMapeada().concat(listaMapeadaPropriedades());
    return valorItems;
  }, [listaMapeada, listaMapeadaPropriedades]);

  const elementosFocados = useMemo(() => {
    if (mapaContext.elementosFoco && mapaContext.elementosFoco.length > 0)
      return mapaContext.elementosFoco.map((x) => x.id);
    if (mapaContext.elementoFoco) return mapaContext.elementoFoco.id;
  }, [mapaContext.elementosFoco, mapaContext.elementoFoco]);

  const setElementosSelecionados = useCallback(() => {
    console.log(
      "useCallback [visTimeline, elementosFocados] ",
      visTimeline,
      elementosFocados
    );
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
        // dispatch({
        //   type: "alteraPropriedadeGeral",
        //   tipo: "fit",
        //   valor: true,
        // });
      }
      if (item.what === "axis") {
        dispatch({ ...item, type: "atualizaTempo" });
        tempoAtualRef.current = item.time;
      }
      if (item.what === "group-label") {
        abrirTooltip(item);
        dispatch({
          type: "selecionarElementosFocoPorId",
          ids: [item.group],
        });
      }
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
  // const handleAlterandoOrdem = useCallback(
  //   (from: any, to: any, groups: DataInterfaceDataGroup) => {
  //     const targetOrder = to.order;
  //     to.order = from.order;
  //     from.order = targetOrder;
  //     if (
  //       //!intervaloRef.current &&
  //       JSON.stringify(dataSetRef.current) !==
  //       JSON.stringify([to.order, from.order].sort((a, b) => a.order - b.order))
  //     ) {
  //       intervaloRef.current = setTimeout(() => {
  //         groups.forEach((x: any) => {
  //           if (listaMapeada().find((z) => z.id === x.id)?.order !== x.order)
  //             dispatch({
  //               type: "editarPropriedade",
  //               tipo: x.dataRef,
  //               id: x.id,
  //               nomePropriedade: "order",
  //               valorPropriedade: x.order,
  //             });
  //         });
  //         intervaloRef.current = null;
  //       }, 0);
  //       dataSetRef.current = [to.order, from.order].sort(
  //         (a, b) => a.order - b.order
  //       );
  //     }
  //   },
  //   [dispatch]
  // );

  const optionsVisTimeline: () => TimelineOptions = useCallback(() => {
    return {
      ...mapaContext.timelineOptions,
      onRemove: handleRemoveConteudo,
      onMove: handleAtualizaConteudo,
      onMoving: handleOnMoving,
      // groupOrderSwap: handleAlterandoOrdem,
      maxHeight: altura,
      start: moment(mapaContext.cenaInicio).format("yyyy-MM-DDTHH:mm:ss"),
      end: moment(mapaContext.cenaFim).format("yyyy-MM-DDTHH:mm:ss"),
    };
  }, [
    mapaContext,
    altura,
    handleOnMoving,
    // handleAlterandoOrdem,
    handleRemoveConteudo,
    handleAtualizaConteudo,
    //handleAdicionarPropriedadeConteudo,
  ]);

  const calls = useCallback(() => {
    const atual = {
      groups: listaMapeada().filter(
        (x) => x.visTimelineObject?.type != "background"
      ),
      items: elementosAlteracoesTimeline(),
    };
    console.log(
      "calls - useCallback [visTimeline, atual, temDiferencaConteudo] ",
      visTimeline,
      atual
    );
    divScrollRef.current = (visTimeline as any).dom.leftContainer.scrollTop;
    console.log(
      "SCROLL GET\n",
      "\nscrollTop: ",
      (visTimeline as any).dom.leftContainer.scrollTop,
      "\nscrollHeight: ",
      (visTimeline as any).dom.leftContainer.scrollHeight
    );
    visTimeline.setData(atual);
    visTimeline.setOptions(optionsVisTimeline());
    setElementosSelecionados();
    elementosTimelineRef.current = atual;
  }, [
    visTimeline,
    elementosAlteracoesTimeline,
    optionsVisTimeline,
    listaMapeada,
    setElementosSelecionados,
  ]);
  useEffect(() => {
    console.log(
      "useEffect [visJsRef, visTimeline]",
      visJsRef.current,
      visTimeline
    );
    if (!visJsRef.current.style.position)
      if (!visTimeline) {
        console.log(
          "useEffect [visJsRef, visTimeline] MONTOU",
          visJsRef.current.style.position
        );
        const tl =
          visJsRef.current &&
          new Timeline(visJsRef.current, null, optionsVisTimeline());
        console.log(">>>timeline montada<<<", tl);
        tl.addCustomTime(optionsVisTimeline().start, "currentTime");
        tempoAtualRef.current = moment(optionsVisTimeline().start)
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
      } else calls();
    else if (visJsRef.current.style.position && visTimeline) calls();
  }, [
    visJsRef,
    visTimeline,
    tempoAtualRef,
    optionsVisTimeline,
    calls,
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
    console.log(
      "useEffect [visTimeline, mapaContext.tempo] ",
      visTimeline,
      mapaContext.tempo
    );
    if (visTimeline)
      visTimeline.setCustomTime(mapaContext.tempo, "currentTime");
  }, [visTimeline, mapaContext.tempo]);

  useEffect(() => {
    console.log("useEffect [setOptionsTimeline] ", visTimeline);
    if (visTimeline) {
      setOptionsTimeline();
      setTimeout(() => {
        console.log(
          "SCROLL SET\n",
          "\nscrollTop: ",
          (visTimeline as any).dom.leftContainer.scrollTop,
          "\nscrollHeight: ",
          (visTimeline as any).dom.leftContainer.scrollHeight,
          "\nscrollTop Antigo:",
          divScrollRef.current
        );
        (visTimeline as any).dom.leftContainer.scroll &&
          (visTimeline as any).dom.leftContainer.scroll(
            0,
            divScrollRef.current
          );
      }, 80);
    }
  }, [visTimeline, setOptionsTimeline]);

  useEffect(setElementosSelecionados, [
    visTimeline,
    elementosFocados,
    setElementosSelecionados,
  ]);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipCoordinates, setTooltipCoordinates] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const abrirTooltip = (item: TimelineEventPropertiesResult) => {
    setTooltipOpen(true);
    setTooltipCoordinates({ x: item.pageX, y: item.pageY });
  };

  return (
    <div
      className="personalized-scrollbar"
      // style={{ overflowY: "scroll", height: "-webkit-fill-available" }}
    >
      <div
        ref={(ref) => {
          visJsRef.current = ref;
        }}
      />
      <Dialog
        open={tooltipOpen}
        hideBackdrop={true}
        onMouseEnter={() => {
          if (tooltipRef.current) clearTimeout(tooltipRef.current);
        }}
        onMouseLeave={() => {
          tooltipRef.current = setTimeout(() => {
            setTooltipOpen(false);
          }, 1500);
        }}
        sx={{
          position: "absolute",
          left: tooltipCoordinates.x,
          top: tooltipCoordinates.y,
          bottom: "auto",
          right: "auto",
          "& .MuiDialog-container": {
            height: "auto",
            "& .MuiPaper-root": {
              margin: 0,
            },
          },
        }}
      >
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="edit"
            onClick={() => {
              if (!mapaContext.slidePropriedade)
                dispatch({ type: "propriedadeToggle" });
              setTooltipOpen(false);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => {
              dispatch({ type: "removeElements" });
              setTooltipOpen(false);
            }}
          >
            <Delete />
          </IconButton>
        </Stack>
      </Dialog>
    </div>
  );
}
