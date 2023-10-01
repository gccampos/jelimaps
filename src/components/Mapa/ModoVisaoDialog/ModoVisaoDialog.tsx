import React, { useCallback, useEffect } from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Button } from "react-bootstrap";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { MODO_VISAO } from "@/components/Studio/Mapa";
import useCaixaDialogo from "@/components/CaixaDialogo/useCaixaDialogo";
import ImageResolver from "@/components/ImageUrlResolver";

export default function ModoVisaoDialog() {
  const { openModalConfirm, closeModalConfirm, onConfirm } = useCaixaDialogo();
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const nameRef = React.useRef("");

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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOpenStreetMap}>OpenStreetMap</Button>
              <Button onClick={handleMapaProprio}>Mapa Próprio</Button>
            </DialogActions>
          </div>
        ),
      });
  }, []);
  return null;
}
