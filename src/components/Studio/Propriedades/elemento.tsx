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
  FormControlLabel,
  Switch,
  Slider,
  Typography,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import MapaFunctionHelpers from "@/components/Mapa/context/MapaFunctionsHelpers";
import { Button } from "react-bootstrap";

const WrapperStyled = styled("div")``;

export default function Elemento() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [value, setValue] = React.useState(
    mapaContext?.elementosFoco
      ?.map((x: any) =>
        MapaFunctionHelpers.retornaElementoOuAlteracaoPorId(mapaContext, x.id)
      )
      .concat([mapaContext?.elementoFoco])
      .filter(
        (x, i, a) => x && a.findIndex((z) => !!z && z.id === x.id) === i
      ) ?? [mapaContext?.elementoFoco]
  );

  return (
    <List sx={{ height: "100%", pt: 0 }} key={"lista"}>
      {value &&
        value.map((x, i) => {
          return (
            <WrapperStyled key={`Wrapper#${x}-${i}`}>
              <ListItemButton
                onClick={() => {
                  setValue((v) => {
                    v[i].collapse = !v[i].collapse;
                    return [...v];
                  });
                }}
              >
                <ListItemText primary={x.nome} />

                {x.collapse || value.length === 1 ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
              <Collapse
                in={x.collapse || value.length === 1}
                className={x.nome}
                timeout="auto"
                unmountOnExit
              >
                <ListItem>
                  <Formik
                    initialValues={x}
                    onSubmit={() => console.log("submtou")}
                    validateOnBlur={true}
                    validationSchema={Yup.object({
                      cenaInicio: Yup.date().test(
                        "data-inicio-menor-que-fim",
                        "O inicio deve ser menor que o final da primeira cena.",
                        (value, context) =>
                          moment(value) <
                          moment(context.options.context.cenaFim)
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
                              type: "editarPropriedade",
                              tipo: x.dataRef,
                              id: x.id,
                              nomePropriedade: e.target.name,
                              valorPropriedade: e.target.value,
                            });
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formik.values.draggable}
                                onChange={() => {
                                  mapaContext.conteudo[x.dataRef].find(
                                    (z) => z.id === x.id
                                  ).draggable = !formik.values.draggable;
                                  dispatch({
                                    type: "editarPropriedade",
                                    tipo: x.dataRef,
                                    id: x.id,
                                    nomePropriedade: "draggable",
                                    valorPropriedade: !formik.values.draggable,
                                  });
                                }}
                                name={"draggable"}
                              />
                            }
                            label={"Editar elemento no mapa"}
                          />
                          <TextField
                            fullWidth
                            id="nome"
                            name="nome"
                            type="text"
                            label="Nome"
                            value={formik.values.nome}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.nome && Boolean(formik.errors.nome)
                            }
                            helperText={
                              formik.touched.nome && formik.errors.nome
                            }
                          />
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
                          {(formik.values as any).radius && (
                            <TextField
                              fullWidth
                              id="radius"
                              name="radius"
                              label="Raio do Circulo"
                              type="number"
                              value={(formik.values as any).radius}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                (formik.touched as any).radius &&
                                Boolean((formik.errors as any).radius)
                              }
                              helperText={
                                (formik.touched as any).radius &&
                                (formik.errors as any).radius
                              }
                            />
                          )}
                          {(formik.values as any).opacity ? (
                            <>
                              <Typography>Opacidade</Typography>
                              <Slider
                                value={(formik.values as any).opacity}
                                name=""
                                min={0}
                                step={0.1}
                                max={1}
                                onChange={(e, newV) =>
                                  dispatch({
                                    type: "editarPropriedade",
                                    tipo: x.dataRef,
                                    id: x.id,
                                    nomePropriedade: "opacity",
                                    valorPropriedade: newV,
                                  })
                                }
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                              />
                            </>
                          ) : (
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: "editarPropriedade",
                                  tipo: x.dataRef,
                                  id: x.id,
                                  nomePropriedade: "opacity",
                                  valorPropriedade: 0.9,
                                })
                              }
                            >
                              {(formik.values as any).opacity === 0
                                ? "Exibir elemento"
                                : "Ativar Opacidade"}
                            </Button>
                          )}
                        </Form>
                      );
                    }}
                  </Formik>
                </ListItem>
              </Collapse>
              <Divider />
            </WrapperStyled>
          );
        })}
    </List>
  );
}
