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
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useMapaContext, useMapaDispatch } from "@/components/Mapa/MapaContext";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import MapaContextChanger from "@/components/Mapa/ContextChangers";
import { Button } from "react-bootstrap";
import useCaixaDialogo from "@/components/CaixaDialogo/useCaixaDialogo";
import { Map } from "leaflet";
import ImageResolver from "@/components/ImageUrlResolver";

const WrapperStyled = styled("div")``;

export default function Elemento(props: { map: Map }) {
  const { map } = props;
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const elementoRef = React.useRef(null);
  const carregaElementosFoco = React.useCallback(() => {
    return (
      mapaContext?.elementosFoco
        ?.map((x: any) =>
          MapaContextChanger.retornaElementoOuAlteracaoPorId(mapaContext, x.id)
        )
        .concat([
          MapaContextChanger.retornaElementoOuAlteracaoPorId(
            mapaContext,
            mapaContext?.elementoFoco?.id
          ),
        ])
        .filter(
          (x, i, a) => x && a.findIndex((z) => !!z && z.id === x.id) === i
        ) ?? [
        MapaContextChanger.retornaElementoOuAlteracaoPorId(
          mapaContext,
          mapaContext?.elementoFoco?.id
        ),
      ]
    );
  }, [mapaContext]);

  const [value, setValue] = React.useState<{ collapse: boolean }[]>(
    carregaElementosFoco().map((x) => {
      return { collapse: x.collapse };
    })
  );

  const urlImageRef = React.useRef<string>();
  const { openModalConfirm, closeModalConfirm, onConfirm } = useCaixaDialogo();

  const handleDispatchInserirImageOverlay = React.useCallback(() => {
    dispatch({
      type: "editarPropriedade",
      tipo: elementoRef.current.dataRef,
      id: elementoRef.current.id,
      nomePropriedade: "imagemURL",
      valorPropriedade: urlImageRef.current,
    });
    elementoRef.current = urlImageRef.current = null;
    closeModalConfirm(null, null);
  }, [dispatch, closeModalConfirm]);

  const handleInserirImagem = React.useCallback(() => {
    openModalConfirm({
      title: "",
      message: "",
      onConfirm,
      cancelarNotVisible: true,
      confirmarNotVisible: true,
      componentMessage: (
        <div>
          <DialogTitle>Por favor, insira a url da imagem</DialogTitle>
          <DialogContent dividers>
            <TextField
              id="outlined-controlled"
              label="Controlled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                urlImageRef.current = event.target.value;
              }}
            />
            {urlImageRef.current &&
            urlImageRef.current !== "" &&
            ImageResolver.isValidUrl(urlImageRef.current) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="MapaProprio"
                src={ImageResolver.UrlResolver(urlImageRef.current)}
                width={1250}
                height={1250}
              />
            ) : (
              <div> Copie um link válido</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInserirImagem}>Atualizar</Button>
            {urlImageRef.current &&
              urlImageRef.current !== "" &&
              ImageResolver.isValidUrl(urlImageRef.current) && (
                <Button onClick={handleDispatchInserirImageOverlay}>
                  Salvar
                </Button>
              )}
          </DialogActions>
        </div>
      ),
    });
  }, [openModalConfirm, onConfirm, handleDispatchInserirImageOverlay]);

  return (
    <List sx={{ height: "100%", pt: 0 }} key={"lista"}>
      {carregaElementosFoco() &&
        carregaElementosFoco().map((x, i) => {
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
                                value={formik.values.draggable}
                                onChange={(e) => {
                                  // mapaContext.conteudo[x.dataRef].find(
                                  //   (z) => z.id === x.id
                                  // ).draggable = !formik.values.draggable;
                                  dispatch({
                                    type: "editarPropriedade",
                                    tipo: x.dataRef,
                                    id: x.id,
                                    nomePropriedade: "draggable",
                                    valorPropriedade: !formik.values.draggable,
                                  });
                                  formik.handleChange(e);
                                }}
                                name={"draggable"}
                              />
                            }
                            label={"Editar elemento no mapa"}
                          />
                          <Button
                            onClick={() => {
                              dispatch({
                                type: "editarPropriedade",
                                tipo: x.dataRef,
                                id: x.id,
                                nomePropriedade: "zoom",
                                valorPropriedade: map.getZoom(),
                              });
                            }}
                          >
                            Fixar zoom
                          </Button>
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
                          {(formik.values as any).positionBL &&
                            ((formik.values as any).opacity ? (
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
                            ))}
                          {!(formik.values as any).positionBL && (
                            <Button
                              onClick={() => {
                                elementoRef.current = formik.values;
                                handleInserirImagem();
                              }}
                            >
                              {(formik.values as any).imagemURL &&
                              (formik.values as any).imagemURL.length
                                ? "Trocar imagem"
                                : "Inserir imagem"}
                            </Button>
                          )}
                          {(formik.values as any).imagemURL &&
                            (formik.values as any).imagemURL.length && (
                              <img
                                src={(formik.values as any).imagemURL}
                                width={"auto"}
                                height={"auto"}
                              />
                            )}
                          <TextField
                            fullWidth
                            id="texto"
                            name="texto"
                            label="Texto"
                            multiline
                            rows={4}
                            value={(formik.values as any).texto}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              (formik.touched as any).texto &&
                              Boolean((formik.errors as any).texto)
                            }
                            helperText={
                              (formik.touched as any).texto &&
                              (formik.errors as any).texto
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
          );
        })}
    </List>
  );
}
