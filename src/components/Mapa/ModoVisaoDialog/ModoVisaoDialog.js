import React from "react";
import Dialog from "@mui/material/Dialog";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Button } from "react-bootstrap";
import { useMapaDispatch } from "@/components/Mapa/context/MapaContext";
import { MODO_VISAO } from "@/components/Studio/Mapa";

export default function ModoVisaoDialog() {
  const [open, setOpen] = React.useState(true);
  const dispatch = useMapaDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleOpenStreetMap = () => {
    dispatch({
      type: "modoVisao",
      arg: MODO_VISAO.openstreetmap,
    });
    //setModoVisao(MODO_VISAO.openstreetmap);
    setOpen(false);
  };
  const handleMapaProprio = () => {
    dispatch({
      type: "modoVisao",
      arg: MODO_VISAO.mapaProprio,
    });
    //setModoVisao(MODO_VISAO.mapaProprio);
    setOpen(false);
  };

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle>Por favor, selecione o modo de visualização</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          OpenStreetMaps: Nesse modo, você utilizará os mapas da base do
          OpenStreetMaps.
        </Typography>
        <Typography gutterBottom>
          Mapa Próprio: Nesse modo, você terá que subir uma imagem para utilizar
          como mapa.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpenStreetMap}>OpenStreetMap</Button>
        <Button onClick={handleMapaProprio}>Mapa Próprio</Button>
      </DialogActions>
    </Dialog>
  );
}
