export function mapaReducer(oldMapaContext, action) {
  console.log("dispatch acionado");
  console.log(action);
  switch (action.type) {
    case "modoVisao": {
      return { ...oldMapaContext, modoVisao: action.arg };
    }
    case "elementos": {
      return {
        ...oldMapaContext,
        elemento: { nome: action.arg, posicao: action.posicao },
      };
    }
    case "desativarElementos": {
      return {
        ...oldMapaContext,
        elemento: { ...oldMapaContext.elemento, nome: "" },
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
