import { create } from "zustand";
import { AlertColor } from "@mui/material/Alert";

export type SnackBarItemType = {
  key?: string;
  text: string;
  color: AlertColor;
  autoHideDuration?: number;
};

type SnackBarProps = {
  items: SnackBarItemType[];
  showSnackBar: (params: SnackBarItemType) => void;
  removeSnackBar: (key: string) => void;
};

const useBarraAlerta = create<SnackBarProps>((set) => ({
  items: [],
  showSnackBar: (params) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...params,
          key: Math.random().toString(),
        },
      ],
    })),
  removeSnackBar: (key: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.key !== key),
    })),
}));

export default useBarraAlerta;
