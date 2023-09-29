import { ReactNode } from "react";
import { create } from "zustand";

type OpenModalConfirmParams = {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose?: () => void;
  cancelarNotVisible?: boolean;
  componentMessage?: ReactNode;
  confirmarNotVisible?: boolean;
};

type ModalConfirmProps = {
  open: boolean;
  refreshed?: boolean;
  openModalConfirm: (params: OpenModalConfirmParams) => void;
  closeModalConfirm: () => void;
} & OpenModalConfirmParams;

const useCaixaDialogo = create<ModalConfirmProps>((set, value) => ({
  open: false,
  title: "",
  message: "",
  onConfirm: () => {},
  openModalConfirm: (parametros: OpenModalConfirmParams) =>
    set(() => ({
      open: true,
      ...parametros,
      onConfirm: () => {
        set({ open: false });
        parametros.onConfirm();
      },
    })),
  closeModalConfirm: () => {
    if (value().onClose) value().onClose();
    set(() => ({
      open: false,
      title: "",
      message: "",
    }));
  },
}));

export default useCaixaDialogo;
