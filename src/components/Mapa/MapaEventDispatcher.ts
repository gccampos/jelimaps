import { actionContextChange, mapaContextSchema } from "./mapaContextTypes";
import MapaContextChanger from "./ContextChangers";

export function mapaReducer(
  oldMapaContext: mapaContextSchema,
  action: actionContextChange
): mapaContextSchema {
  console.log(
    `metodoDispatch [TYPE:${action.type}] disparado`,
    oldMapaContext,
    action
  );
  switch (action.type) {
    case "selecionarElementoInteracao": {
      return MapaContextChanger.changeElementoInteracao(
        oldMapaContext,
        action.arg
      );
    }
    case "adicionarElementoFoco": {
      return MapaContextChanger.changeElementosFoco(oldMapaContext, action);
    }
    case "adicionarAlteracaoElemento": {
      return MapaContextChanger.addAlteracaoElemento(oldMapaContext, action);
    }
    case "selecionarElementosFoco": {
      return MapaContextChanger.changeTodosElementosFoco(
        oldMapaContext,
        action
      );
    }
    case "selecionarElementoFoco": {
      return MapaContextChanger.changeElementoFoco(oldMapaContext, action);
    }
    case "selecionarElementosFocoPorId": {
      return MapaContextChanger.changeTodosElementosFocoPorIds(
        oldMapaContext,
        action
      );
    }
    case "addElemento": {
      return MapaContextChanger.addElementoPadrao(oldMapaContext, action);
    }
    case "alteraCoordinatesElemento": {
      return MapaContextChanger.alteraCoordinatesElemento(
        oldMapaContext,
        action
      );
    }
    case "adicionarImageOverlay": {
      return MapaContextChanger.addElementoImagem(oldMapaContext, action);
    }
    case "toggleCollapseTimeline": {
      action.tipo = oldMapaContext.elementoFoco.dataRef;
      action.id = oldMapaContext.elementoFoco.id;
      action.nomePropriedade = "collapseTimeline";
      action.valorPropriedade = !oldMapaContext.elementoFoco.collapseTimeline;

      return MapaContextChanger.editarPropriedadeElemento(
        oldMapaContext,
        action
      );
    }
    case "removeElements": {
      return MapaContextChanger.removeElemento(oldMapaContext, action);
    }
    case "updateTimelineElement": {
      return MapaContextChanger.atualizaLinhaTempoElemento(
        oldMapaContext,
        action
      );
    }
    case "editarPropriedade": {
      return MapaContextChanger.editarPropriedadeElemento(
        oldMapaContext,
        action
      );
    }
    case "movendoImagem": {
      return MapaContextChanger.movendoImagem(oldMapaContext, action);
    }
    case "propriedadeToggle": {
      action.nomePropriedade = "slidePropriedade";
      action.valorPropriedade = !oldMapaContext.slidePropriedade;
      return MapaContextChanger.changePropriedadeMapa(oldMapaContext, action);
    }
    case "modoVisao": {
      return MapaContextChanger.selecionaModoVisao(oldMapaContext, action);
    }
    case "alteraPropriedadesMapa": {
      return MapaContextChanger.changeCoordenadasMapa(oldMapaContext, action);
    }
    case "trocaMapaContext": {
      return MapaContextChanger.changeCompletoMapaContext(
        oldMapaContext,
        action
      );
    }
    case "limpaCaixaDialogo": {
      action.nomePropriedade = "caixaDialogo";
      action.valorPropriedade = "";
      return MapaContextChanger.changePropriedadeMapa(oldMapaContext, action);
    }
    case "atualizaTempo": {
      return MapaContextChanger.changeTempoAtual(oldMapaContext, action);
    }
    case "alteraTempoInicioFim": {
      return MapaContextChanger.changeTempoInicioTempoFim(
        oldMapaContext,
        action
      );
    }
    case "alteraPropriedadeGeral": {
      return MapaContextChanger.changePropriedadeMapa(oldMapaContext, action);
    }
    case "inserindoNovaCena": {
      return MapaContextChanger.adicionarNovaCena(oldMapaContext);
    }
    case "deletarCena": {
      return MapaContextChanger.deletarCena(oldMapaContext, action);
    }
    case "alteraPropriedadeCena": {
      return MapaContextChanger.changePropriedadeCena(oldMapaContext, action);
    }
    case "fixarCena": {
      return MapaContextChanger.fixarCena(oldMapaContext, action);
    }
    case "addImageOverlay": {
      action.nomePropriedade = "caixaDialogo";
      action.valorPropriedade = "imageOverlay";
      return MapaContextChanger.changePropriedadeMapa(oldMapaContext, action);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
