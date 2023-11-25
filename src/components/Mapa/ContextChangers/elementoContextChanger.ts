import { mapaContextSchema } from "../mapaContextTypes";

const movendoImagem = (
  oldMapaContext: mapaContextSchema,
  actionContextChange: actionContextChange
): mapaContextSchema => {
  const elemento = oldMapaContext.conteudo.ImageOverlay.find(
    (x) => x.id === actionContextChange.id
  );
  elemento.positionTL = actionContextChange.valor.positionTL;
  elemento.positionTR = actionContextChange.valor.positionTR;
  elemento.positionBL = actionContextChange.valor.positionBL;
  return {
    ...oldMapaContext,
  };
};
