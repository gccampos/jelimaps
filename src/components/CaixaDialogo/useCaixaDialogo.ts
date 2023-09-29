import { ReactNode } from "react";
import { create } from "zustand";

type OpenModalConfirmParams = {
  title: string;
  message: string;
  onConfirm: () => void;

  cancelarNotVisible?: boolean;
  componentMessage?: ReactNode;
  confirmarNotVisible?: boolean;
};

type ModalConfirmProps = {
  open: boolean;
  openModalConfirm: (params: OpenModalConfirmParams) => void;
  closeModalConfirm: () => void;
} & OpenModalConfirmParams;

const useCaixaDialogo = create<ModalConfirmProps>((set) => ({
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
  closeModalConfirm: () =>
    set(() => ({
      open: false,
      title: "",
      message: "",
    })),
}));

export default useCaixaDialogo;
