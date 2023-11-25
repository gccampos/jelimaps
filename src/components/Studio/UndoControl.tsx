import { Button, ButtonGroup, styled } from "@mui/material";
import React from "react";
import { Undo, Redo } from "@mui/icons-material";
import { useMapaUndo } from "../Mapa/MapaContext";

// type Props = {};

const DivStil = styled("div")`
  padding-top: 75px;
  padding-left: 1px;
  & .MuiButtonGroup-vertical {
    width: 32px;
    & button {
      min-width: inherit;
      background-color: white;
      & svg {
        font-size: 20px;
      }
    }
    & button:not(:disabled) {
      color: black;
    }
  }
`;

export default function UndoControl() {
  const { undo, redo, canRedo, canUndo } = useMapaUndo();
  return (
    <DivStil>
      <ButtonGroup
        orientation="vertical"
        aria-label="vertical contained button group"
        variant="contained"
      >
        <Button key="undo" disabled={!canUndo} onClick={undo}>
          <Undo />
        </Button>
        <Button key="redo" disabled={!canRedo} onClick={redo}>
          <Redo />
        </Button>
      </ButtonGroup>
    </DivStil>
  );
}
