import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Timeline,
  TimelineEventPropertiesResult,
  TimelineItem,
  TimelineOptions,
} from "vis-timeline/standalone";
import { useMapaContext, useMapaDispatch } from "@/components/Mapa/MapaContext";
import {
  elementoPadrao,
  tipoElemento,
  tipoGenericoElementoTimeline,
} from "@/components/Mapa/mapaContextTypes";
import { v4 } from "uuid";
import moment from "moment";
import { Dialog, IconButton, Stack } from "@mui/material";
import { Delete, Edit, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import useCaixaDialogo from "@/components/CaixaDialogo/useCaixaDialogo";

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
  const alturaRef = useRef(0);
  const elementosFocadosRef = useRef(null);
  const elementosFocadosRealRef = useRef(null);
  const eventRef = useRef(null);
  const { openModalConfirm } = useCaixaDialogo();
  const startMapaContextRef = useRef(mapaContext.cenaInicio);
  const endMapaContextRef = useRef(mapaContext.cenaFim);
  // const elementos = useRef(
  //   useListaElementos().filter((x) => x.visTimelineObject?.type != "background")
  // );
  // elementos.current = useListaElementos().filter(
  //   (x) => x.visTimelineObject?.type != "background"
  // );

  useEffect(() => {
    startMapaContextRef.current = mapaContext.cenaInicio;
    endMapaContextRef.current = mapaContext.cenaFim;
  }, [mapaContext.cenaInicio, mapaContext.cenaFim]);
  useEffect(() => {
    if (mapaContext.elementosFoco && mapaContext.elementosFoco.length > 0)
      elementosFocadosRealRef.current = mapaContext.elementosFoco.map(
        (x) => x.id
      );
    else if (mapaContext.elementoFoco)
      elementosFocadosRealRef.current = [mapaContext.elementoFoco.id];
    else elementosFocadosRealRef.current = null;
  }, [mapaContext.elementosFoco, mapaContext.elementoFoco]);
  const elementosFocados = useCallback(() => {
    return elementosFocadosRealRef.current;
  }, []);

  const listaMapeada = useCallback(
    (lista?: (tipoElemento | tipoGenericoElementoTimeline)[]) => {
      return (
        lista ?? mapaContext?.conteudo
          ? Object.keys(mapaContext?.conteudo)
              .map((x) => mapaContext?.conteudo[x])
              .flat()
          : []
      ).map((x) => {
        return {
          ...x,
          type: x.visTimelineObject?.type ?? null,
          group: !x.visTimelineObject?.type
            ? x.id
            : x.visTimelineObject.type === "box"
            ? x.group
            : null,
          style:
            x.visTimelineObject?.type == "background"
              ? `background-color: ${x.color}`
              : x.style,
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
    const valorItems = listaMapeada()
      .concat(listaMapeadaPropriedades())
      .filter(
        (value, index, self) =>
          self.findIndex((x) => x.id === value.id) === index
      );
    return valorItems;
  }, [listaMapeada, listaMapeadaPropriedades]);

  const setElementosSelecionados = useCallback(() => {
    if (visTimeline) visTimeline.setSelection(elementosFocados());
  }, [visTimeline, elementosFocados]);

  const handleSeleciona = useCallback(
    (item: any) => {
      if (
        item.event.srcEvent.type === "pointerup" ||
        item.event.srcEvent.type === "pointerdown"
      ) {
        dispatch({
          type: "selecionarElementosFocoPorId",
          ids: item.items,
        });
        elementosFocadosRef.current = elementosFocados();
      } else {
        item.event.preventDefault();
      }
    },
    [dispatch, elementosFocados]
  );

  const handleRemoveConteudo = useCallback(
    (item: TimelineItem) => {
      // draw.removeFeatures([item.id.toString()]);
      openModalConfirm({
        title: "Deletar item",
        message: "Você tem certeza disso?",
        onConfirm: () => {
          dispatch({
            type: "removeElements",
            id: item.id,
            group: item.group,
          });
        },
      });
    },
    [dispatch, openModalConfirm]
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
          type: "selecionarElementoFoco",
          id: item.group,
          //  elementosAlteracoesTimeline().find(
          //   (x) => x.id === item.group
          // ),
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
  const handleChange = useCallback(
    (properties: any) => {
      const { start, end } = properties;
      if (
        startMapaContextRef.current !==
          moment(start).format("yyyy-MM-DDTHH:mm:ss") ||
        endMapaContextRef.current !== moment(end).format("yyyy-MM-DDTHH:mm:ss")
      ) {
        clearTimeout(eventRef.current);
        eventRef.current = setTimeout(() => {
          dispatch({
            type: "alteraTempoInicioFim",
            start: moment(start).format("yyyy-MM-DDTHH:mm:ss"),
            end: moment(end).format("yyyy-MM-DDTHH:mm:ss"),
          });
          eventRef.current = null;
        }, 100);
      }
    },
    [dispatch, startMapaContextRef, endMapaContextRef]
  );

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
      items: elementosAlteracoesTimeline().filter((x) => !x.collapseTimeline),
    };
    if (
      !elementosTimelineRef.current ||
      atual.items.length !== elementosTimelineRef.current?.items.length ||
      alturaRef.current !== altura
    ) {
      visTimeline.setData(atual);
      visTimeline.setOptions(optionsVisTimeline());
      elementosTimelineRef.current = atual;
      alturaRef.current = altura;
    }
    if (elementosFocadosRef.current !== elementosFocados()) {
      setElementosSelecionados();
      elementosFocadosRef.current = elementosFocados();
      setTimeout(() => {
        if (elementosFocados()) visTimeline?.focus([...elementosFocados()]);
      }, 100);
    }
  }, [
    altura,
    visTimeline,
    elementosFocados,
    elementosAlteracoesTimeline,
    optionsVisTimeline,
    listaMapeada,
    setElementosSelecionados,
  ]);
  useEffect(() => {
    if (!visJsRef.current.style.position)
      if (!visTimeline) {
        const tl =
          visJsRef.current &&
          new Timeline(visJsRef.current, null, optionsVisTimeline());
        tl.addCustomTime(optionsVisTimeline().start, "currentTime");
        tempoAtualRef.current = moment(optionsVisTimeline().start)
          .add(1, "seconds")
          .format("yyyy-MM-DDTHH:mm:ss");
        setVisTimeline(tl);
        tl.on("select", handleSeleciona);
        tl.on("click", handleClick);
        // tl.on("changed", () => handleChange(tl));
        tl.on("rangechange", handleChange);
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
    handleChange,
    listaMapeada,
    setVisTimeline,
    handleSeleciona,
    handleDoubleClick,
  ]);

  const setOptionsTimeline = useCallback(() => {
    if (mapaContext.playStatus === 0)
      dispatch({
        type: "alteraPropriedadeGeral",
        nomePropriedade: "playStatus",
        valorPropriedade: -1,
      });
    if (mapaContext.fit) {
      visTimeline.fit();
      dispatch({
        type: "alteraPropriedadeGeral",
        nomePropriedade: "fit",
        valorPropriedade: false,
      });
    }
  }, [dispatch, mapaContext, visTimeline]);

  useEffect(() => {
    if (visTimeline)
      visTimeline.setCustomTime(mapaContext.tempo, "currentTime");
  }, [visTimeline, mapaContext.tempo]);

  useEffect(() => {
    if (visTimeline) {
      setOptionsTimeline();
    }
  }, [visTimeline, setOptionsTimeline]);

  useEffect(setElementosSelecionados, [
    visTimeline,
    elementosFocados,
    setElementosSelecionados,
  ]);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOptions, setTooltipOptions] = useState({
    x: 0,
    y: 0,
    collapseTimeline: false,
  });
  const tooltipRef = useRef(null);
  const abrirTooltip = (item: TimelineEventPropertiesResult) => {
    const _listaElementos = elementosTimelineRef.current?.groups;
    setTooltipOptions({
      x: item.pageX,
      y: item.pageY,
      collapseTimeline:
        _listaElementos.find((x) => x.id === item.group)?.collapseTimeline ??
        false,
    });
    setTooltipOpen(true);
  };

  return (
    <div className="personalized-scrollbar">
      <div
        ref={(ref) => {
          visJsRef.current = ref;
        }}
        style={{ height: "100%" }}
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
          }, 700);
        }}
        sx={{
          position: "absolute",
          left: tooltipOptions.x,
          top: tooltipOptions.y,
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
            aria-label={
              !tooltipOptions.collapseTimeline
                ? "diminuir visualização"
                : "aumentar visualização"
            }
            onClick={() => {
              dispatch({ type: "toggleCollapseTimeline" });
              setTooltipOpen(false);
            }}
          >
            {!tooltipOptions.collapseTimeline ? <UnfoldLess /> : <UnfoldMore />}
          </IconButton>
          <IconButton
            aria-label="editar"
            onClick={() => {
              if (!mapaContext.slidePropriedade)
                dispatch({ type: "propriedadeToggle" });
              setTooltipOpen(false);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="deletar"
            onClick={() => {
              openModalConfirm({
                title: "Deletar item",
                message: "Você tem certeza disso?",
                onConfirm: () => {
                  dispatch({
                    type: "removeElements",
                  });
                },
              });
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
