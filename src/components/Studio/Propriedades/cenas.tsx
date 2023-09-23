import React from "react";
import {
  styled,
  List,
  Collapse,
  Divider,
  ListItemButton,
  ListItemText,
  ListItem,
  TextField,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { ExpandLess, ExpandMore, Queue } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";

const WrapperStyled = styled("div")``;

export default function Cenas() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  return (
    <List sx={{ height: "100%", pt: 0 }} key={"lista"}>
      {mapaContext?.conteudo.cenas &&
        mapaContext?.conteudo.cenas.map((x, i) => (
          <WrapperStyled key={`Wrapper#${x}-${i}`}>
            <ListItemButton
              onClick={() => {
                mapaContext.conteudo.cenas[i].collapse =
                  !mapaContext.conteudo.cenas[i].collapse;
                dispatch({
                  type: "trocaMapaContext",
                  mapContext: { ...mapaContext },
                });
              }}
            >
              <ListItemText primary={x.nome} />

              {!mapaContext?.conteudo.cenas[i].collapse ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
            <Collapse
              in={mapaContext?.conteudo.cenas[i].collapse}
              className={x.nome}
              timeout="auto"
              unmountOnExit
            >
              <ListItem>
                <Formik
                  initialValues={x}
                  onSubmit={() => console.log("submtou")}
                  validateOnChange={true}
                  validationSchema={Yup.object({
                    cenaInicio: Yup.date().test(
                      "data-inicio-menor-que-fim",
                      "O inicio deve ser menor que o final da primeira cena.",
                      (value, context) =>
                        moment(value) < moment(context.options.context.cenaFim)
                    ),
                    cenaFim: Yup.date().test(
                      "data-fim-maior-que-inicio",
                      "O final deve ser maior que o inicio da ultima cena.",
                      (value, context) =>
                        moment(value) >
                        moment(context.options.context.cenaInicio)
                    ),
                  })}
                >
                  {(formik) => {
                    return (
                      <Form
                        onBlur={(e: any) => {
                          dispatch({
                            type: "alteraPropriedadeCena",
                            tipo: e.target.name,
                            valor: e.target.value,
                            indiceElemento: i,
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
                            formik.touched.cenaInicio &&
                            Boolean(formik.errors.cenaInicio)
                          }
                          helperText={
                            formik.touched.cenaInicio &&
                            formik.errors.cenaInicio
                          }
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
                          error={
                            formik.touched.cenaFim &&
                            Boolean(formik.errors.cenaFim)
                          }
                          helperText={
                            formik.touched.cenaFim && formik.errors.cenaFim
                          }
                        />
                      </Form>
                    );
                  }}
                </Formik>
              </ListItem>
            </Collapse>
            <Divider />
          </WrapperStyled>
        ))}
      <ListItemButton onClick={() => dispatch({ type: "inserindoNovaCena" })}>
        <ListItemText primary="Criar nova cena" />
        <Queue />
      </ListItemButton>
    </List>
  );
}
