import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useCaixaDialogo from "./useCaixaDialogo";
import Button from "../Atomic/Button";

export default function CaixaDialogoProvider() {
  const {
    open,
    title,
    message,
    cancelarTitle,
    confirmarTitle,
    cancelarNotVisible,
    confirmarNotVisible,
    componentMessage: ComponentMessage,
    onConfirm,
    onCancel,
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
            <Button
              onClick={() => {
                closeModalConfirm(null, null);
                onCancel();
              }}
              variant="outlined"
            >
              {cancelarTitle ?? "Cancelar"}
            </Button>
          )}
          {!confirmarNotVisible && (
            <Button onClick={onConfirm} variant="contained" color="primary">
              {confirmarTitle ?? "Confirmar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
