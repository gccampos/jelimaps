import React, { useState } from "react";
import {
  ListItemButton,
  ListItemText,
  ListItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useMapaContext, useMapaDispatch } from "@/components/Mapa/MapaContext";
import { Queue } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { elementoPadrao } from "@/components/Mapa/mapaContextTypes";

export default function Cenas() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  const cenaSelectedRef = React.useRef(
    mapaContext?.conteudo.cenas.find((x) => x.properties?.selected) ??
      mapaContext?.conteudo.cenas[0]
  );
  const [index, setIndex] = useState(0);
  const [troca, setTroca] = useState(false);
  React.useEffect(() => {
    const i = mapaContext?.conteudo.cenas.findIndex(
      (x) => x.id === cenaSelectedRef.current.id
    );
    if (cenaSelectedRef.current && cenaSelectedRef.current.id && i != index) {
      setIndex(i);
      setTroca(!troca);
    }
  }, [index, mapaContext?.conteudo.cenas, troca]);

  const CenaSelecionadaComponent = () => {
    return (
      <ListItem>
        <Formik
          initialValues={cenaSelectedRef.current as elementoPadrao}
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
                moment(value) > moment(context.options.context.cenaInicio)
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
                    indiceElemento: index,
                    formik: formik,
                  });
                }}
              >
                <TextField
                  fullWidth
                  id="nome"
                  name="nome"
                  label="Título"
                  value={formik.values.nome}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    (formik.touched as any).nome &&
                    Boolean((formik.errors as any).nome)
                  }
                  helperText={
                    (formik.touched as any).nome && (formik.errors as any).nome
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
                    formik.touched.cenaInicio && formik.errors.cenaInicio
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
                    formik.touched.cenaFim && Boolean(formik.errors.cenaFim)
                  }
                  helperText={formik.touched.cenaFim && formik.errors.cenaFim}
                />
                {/* <FormControlLabel
              control={
                <Switch
                  checked={formik.values.exibirLimite}
                  onChange={(e, checked) => {
                    dispatch({
                      type: "alteraPropriedadeCena",
                      tipo: "exibirLimite",
                      valor: checked,
                      indiceElemento: i,
                      formik: formik,
                    });
                  }}
                  name={"exibirLimite"}
                />
              }
              label={"Exibir tamanho da cena"}
            /> */}
                <TextField
                  fullWidth
                  id="texto"
                  name="texto"
                  label="Texto"
                  multiline
                  rows={4}
                  value={formik.values.texto}
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
                <Button
                  onClick={() => {
                    dispatch({
                      type: "fixarCena",
                      id: cenaSelectedRef.current.id,
                    });
                  }}
                >
                  Fixar tela
                </Button>
                {mapaContext?.conteudo.cenas.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      dispatch({
                        type: "deletarCena",
                        id: cenaSelectedRef.current.id,
                      });
                    }}
                  >
                    Deletar Cena
                  </Button>
                )}
              </Form>
            );
          }}
        </Formik>
      </ListItem>
    );
  };
  return (
    <>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
        <InputLabel id="demo-simple-select-standard-label">
          Escolha a cena para editar
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          sx={{ backgroundColor: cenaSelectedRef.current?.color }}
          value={
            cenaSelectedRef.current?.id ?? mapaContext?.conteudo.cenas[0].id
          }
          onChange={(e, c: any) => {
            dispatch({
              type: "selecionarCena",
              id: c.props.value,
              tipo: "cenas",
              nomePropriedade: "properties",
              valorPropriedade: {
                ...mapaContext?.conteudo.cenas.find(
                  (x) => x.id.toString() === c.props.value
                ).properties,
                selected: true,
              },
            });
            // setCenaSelecionada(
            //   mapaContext?.conteudo.cenas.find(
            //     (x) => x.id.toString() === c.props.value
            //   )
            // );
          }}
          label="Age"
        >
          {mapaContext?.conteudo.cenas &&
            mapaContext?.conteudo.cenas.map((x, i) => (
              <MenuItem
                style={{ backgroundColor: x.color }}
                value={x.id}
                key={`select#${i}`}
              >
                {x.nome}
              </MenuItem>
            ))}
        </Select>
        <ListItemButton onClick={() => dispatch({ type: "inserindoNovaCena" })}>
          <ListItemText primary="Criar nova cena" />
          <Queue />
        </ListItemButton>
      </FormControl>
      {cenaSelectedRef.current &&
        (troca ? <CenaSelecionadaComponent /> : <CenaSelecionadaComponent />)}
    </>
  );
}
