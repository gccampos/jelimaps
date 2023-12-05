import { ReactNode } from "react";
import { create } from "zustand";

type OpenModalConfirmParams = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClosed?: () => void;
  cancelarTitle?: string;
  confirmarTitle?: string;
  cancelarNotVisible?: boolean;
  componentMessage?: ReactNode;
  confirmarNotVisible?: boolean;
  fecharApenasComEvento?: boolean;
};

type ModalConfirmProps = {
  open: boolean;
  refreshed?: boolean;
  openModalConfirm: (params: OpenModalConfirmParams) => void;
  closeModalConfirm: (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => void;
} & OpenModalConfirmParams;

const useCaixaDialogo = create<ModalConfirmProps>((set, value) => ({
  open: false,
  title: "",
  message: "",
  // cancelarTitle: "",
  // confirmarTitle: "",
  onConfirm: () => {},
  onCancel: () => {},
  openModalConfirm: (parametros: OpenModalConfirmParams) => {
    set(() => ({
      open: true,
      componentMessage: null,
      cancelarNotVisible: null,
      confirmarNotVisible: null,
      fecharApenasComEvento: null,
      ...parametros,
      onConfirm: () => {
        set({ open: false });
        parametros.onConfirm();
      },
    }));
  },
  closeModalConfirm: (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (value().fecharApenasComEvento && reason) return;
    if (value().onClosed) value().onClosed();
    set(() => ({
      open: false,
      title: "",
      message: "",
    }));
  },
}));

export default useCaixaDialogo;
