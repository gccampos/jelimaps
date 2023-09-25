import React from "react";
import {
  TextField,
  // FormControlLabel, Switch
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { Form, Formik } from "formik";
import * as Yup from "yup";

export default function Geral() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

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
              dispatch({
                type: "alteraPropriedadeGeral",
                tipo: e.target.name,
                valor: e.target.value,
                formik: formik,
              });
            }}
          >
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
