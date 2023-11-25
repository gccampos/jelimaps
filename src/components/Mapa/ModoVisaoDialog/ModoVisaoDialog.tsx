import React, { useCallback, useEffect } from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  styled,
  Button as ButtonMUI,
} from "@mui/material";
import { Button } from "react-bootstrap";
import {
  useMapaContext,
  useMapaDispatch,
  useMapaUndo,
} from "@/components/Mapa/MapaContext";
import { MODO_VISAO } from "@/components/Studio/MapaAdapter";
import useCaixaDialogo from "@/components/CaixaDialogo/useCaixaDialogo";
import ImageResolver from "@/components/ImageUrlResolver";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ModoVisaoDialog() {
  const { openModalConfirm, closeModalConfirm, onConfirm } = useCaixaDialogo();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const nameRef = React.useRef("");
  const { reset } = useMapaUndo();

  const handleOpenStreetMap = useCallback(() => {
    dispatch({
      type: "modoVisao",
      tipo: MODO_VISAO.openstreetmap,
    });
    closeModalConfirm(null, null);
  }, [closeModalConfirm, dispatch]);

  const handleMapaProprioComImagem = useCallback(() => {
    dispatch({
      type: "modoVisao",
      tipo: MODO_VISAO.mapaProprio,
      valor: ImageResolver.UrlResolver(nameRef.current),
    });
    closeModalConfirm(null, null);
  }, [closeModalConfirm, dispatch]);

  const handleMapaProprio = useCallback(() => {
    openModalConfirm({
      title: "",
      message: "",
      onConfirm,
      cancelarNotVisible: true,
      confirmarNotVisible: true,
      fecharApenasComEvento: true,
      componentMessage: (
        <div>
          <DialogTitle>
            Por favor, insira a url da imagem do seu mapa!
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              id="outlined-controlled"
              label="Controlled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                nameRef.current = event.target.value;
              }}
            />
            {nameRef.current &&
            nameRef.current !== "" &&
            ImageResolver.isValidUrl(nameRef.current) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="MapaProprio"
                src={ImageResolver.UrlResolver(nameRef.current)}
                width={1250}
                height={1250}
              />
            ) : (
              <div> Copie um link válido</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMapaProprio}>Atualizar</Button>
            {nameRef.current &&
              nameRef.current !== "" &&
              ImageResolver.isValidUrl(nameRef.current) && (
                <Button onClick={handleMapaProprioComImagem}>Salvar</Button>
              )}
          </DialogActions>
        </div>
      ),
    });
  }, [openModalConfirm, onConfirm, handleMapaProprioComImagem]);

  useEffect(() => {
    if (!mapaContext.modoVisao)
      openModalConfirm({
        title: "",
        message: "",
        onConfirm,
        cancelarNotVisible: true,
        confirmarNotVisible: true,
        fecharApenasComEvento: true,
        componentMessage: (
          <div>
            <DialogTitle>
              Por favor, selecione o modo de visualização
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                OpenStreetMaps: Nesse modo, você utilizará os mapas da base do
                OpenStreetMaps.
              </Typography>
              <Typography gutterBottom>
                Mapa Próprio: Nesse modo, você terá que subir uma imagem para
                utilizar como mapa.
              </Typography>
              <div id="resultado"></div>
            </DialogContent>
            <DialogActions>
              <ButtonMUI variant="contained" onClick={handleOpenStreetMap}>
                OpenStreetMap
              </ButtonMUI>
              <ButtonMUI variant="contained" onClick={handleMapaProprio}>
                Mapa Próprio
              </ButtonMUI>
              <ButtonMUI variant="contained" sx={{ mx: 1 }} component="label">
                Continuar projeto
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => {
                    var arquivo = e.target.files[0];

                    // Verificar se o arquivo tem a extensão .griot
                    if (arquivo.name.endsWith(".griot")) {
                      // Criar um objeto FileReader para ler o arquivo
                      var leitor = new FileReader();

                      // Definir uma função que é chamada quando o arquivo é lido
                      leitor.onload = function (e) {
                        // Obter o conteúdo do arquivo como uma string

                        // Tentar converter o texto em um objeto JSON
                        try {
                          const texto = e.target.result as string;
                          var json = JSON.parse(texto);

                          // Mostrar o JSON na tela
                          reset(json);
                          document.getElementById("resultado").innerHTML =
                            JSON.stringify(json, null, 2);
                          closeModalConfirm(null, null);
                        } catch (erro) {
                          // Mostrar o erro na tela
                          document.getElementById("resultado").innerHTML =
                            "Erro ao converter o texto em JSON: " +
                            erro.message;
                        }
                      };

                      // Ler o arquivo como uma string
                      leitor.readAsText(arquivo);
                    } else {
                      // Mostrar uma mensagem de erro na tela
                      document.getElementById("resultado").innerHTML =
                        "O arquivo selecionado não tem a extensão .griot";
                    }
                  }}
                />
              </ButtonMUI>
            </DialogActions>
          </div>
        ),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapaContext.modoVisao]);
  return null;
}
