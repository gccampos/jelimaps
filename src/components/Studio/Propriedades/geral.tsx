import React from "react";
import {
  Button,
  ButtonGroup,
  TextField,
  // FormControlLabel, Switch
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
  useMapaUndo,
} from "@/components/Mapa/MapaContext";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import useCaixaDialogo from "@/components/CaixaDialogo/useCaixaDialogo";

export default function Geral() {
  const mapaContext = useMapaContext();
  const { reset } = useMapaUndo();
  const dispatch = useMapaDispatch();
  const { openModalConfirm } = useCaixaDialogo();

  return (
    <Formik
      initialValues={mapaContext}
      onSubmit={() => console.log("submtou")}
      validateOnBlur={true}
      validationSchema={Yup.object({
        cenaInicio: Yup.date().max(
          mapaContext.conteudo.cenas[0].cenaFim,
          "O inicio deve ser menor que o final da primeira cena."
        ),
        cenaFim: Yup.date().min(
          mapaContext.conteudo.cenas[mapaContext.conteudo.cenas.length - 1]
            .cenaInicio,
          "O final deve ser maior que o inicio da ultima cena."
        ),
      })}
    >
      {(formik) => {
        return (
          <Form
            onBlur={(e: any) => {
              if (!!e.target.name && !!e.target.value)
                dispatch({
                  type: "alteraPropriedadeGeral",
                  nomePropriedade: e.target.name,
                  valorPropriedade: e.target.value,
                  formik: formik,
                });
            }}
          >
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button
                onClick={() => {
                  openModalConfirm({
                    title: "Começar um novo",
                    message:
                      "Vai perder todas alterações feitas, tem certeza disso?",
                    onConfirm: () => {
                      reset();
                    },
                  });
                }}
              >
                Resetar
              </Button>
              {/* <Button component="label">
                Importar
                <VisuallyHiddenInput type="file" />
              </Button> */}
              <Button
                onClick={() => {
                  const conteudo = JSON.stringify(mapaContext);
                  const blob = new Blob([conteudo], { type: "text/plain" });
                  var url = URL.createObjectURL(blob);
                  var a = document.createElement("a");
                  a.href = url;
                  a.download = "arquivo.griot";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                Exportar
              </Button>
            </ButtonGroup>
            <TextField
              fullWidth
              id="cenaInicio"
              name="cenaInicio"
              label="Inicio"
              type="datetime-local"
              value={formik.values.cenaInicio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.cenaInicio && Boolean(formik.errors.cenaInicio)
              }
              helperText={formik.touched.cenaInicio && formik.errors.cenaInicio}
            />
            <TextField
              fullWidth
              id="cenaFim"
              name="cenaFim"
              label="Final"
              type="datetime-local"
              value={formik.values.cenaFim}
              inputProps={{
                step: 1,
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cenaFim && Boolean(formik.errors.cenaFim)}
              helperText={formik.touched.cenaFim && formik.errors.cenaFim}
            />
            {/* <FormControlLabel
              control={
                <Switch
                  checked={formik.values.reloadTimelineOptions}
                  onChange={(e, c) => {
                    dispatch({
                      type: "alteraPropriedadeGeral",
                      tipo: e.target.name,
                      valor: c,
                      formik: formik,
                    });
                  }}
                  name={"reloadTimelineOptions"}
                />
              }
              label={"Recarregar linha do tempo"}
            /> */}
          </Form>
        );
      }}
    </Formik>
  );
}
