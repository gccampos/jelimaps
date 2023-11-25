import cenaContextChanger from "./cenaContextChanger";
import conteudoContextChanger from "./conteudoContextChanger";
import auxiliadorRetornoContext from "./auxiliadorRetornoContext";
import focoInteracaoContextChanger from "./focoInteracaoContextChanger";

const contextChangers = {
  ...cenaContextChanger,
  ...conteudoContextChanger,
  ...auxiliadorRetornoContext,
  ...focoInteracaoContextChanger,
};

export default contextChangers;
