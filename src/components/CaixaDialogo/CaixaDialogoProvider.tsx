import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useCaixaDialogo from "./useCaixaDialogo";

export default function CaixaDialogoProvider() {
  const {
    open,
    title,
    message,
    cancelarNotVisible,
    confirmarNotVisible,
    componentMessage: ComponentMessage,
    onConfirm,
    closeModalConfirm,
  } = useCaixaDialogo();

  return (
    <>
      <Dialog open={open} onClose={closeModalConfirm}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {ComponentMessage ? (
            ComponentMessage
          ) : (
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {!cancelarNotVisible && (
            <Button onClick={() => closeModalConfirm(null, null)}>
              Cancelar
            </Button>
          )}
          {!confirmarNotVisible && (
            <Button onClick={onConfirm}>Confirmar</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
