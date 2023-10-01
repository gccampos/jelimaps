import React, { useState } from "react";
import {
  styled,
  List,
  Collapse,
  Divider,
  ListItemButton,
  ListItemText,
  ListItem,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import { ExpandLess, ExpandMore, Queue } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { elementoPadrao } from "@/components/Mapa/context/mapaContextTypes";

const WrapperStyled = styled("div")``;

export default function Cenas() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  const [cenaSelecionada, setCenaSelecionada] = useState(mapaContext?.conteudo.cenas[0])
  const [index, setIndex] = useState(0)
  React.useEffect(() => {
    if (cenaSelecionada && cenaSelecionada.id)
      setIndex(mapaContext?.conteudo.cenas.findIndex(x => x.id === cenaSelecionada.id))
  }, [cenaSelecionada])
  return (<>


    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={cenaSelecionada?.id ?? mapaContext?.conteudo.cenas[0].id}
        onChange={(e, c: any) => setCenaSelecionada(mapaContext?.conteudo.cenas.find(x => x.id.toString() === c.props.value))}
        label="Age"
      >
        {mapaContext?.conteudo.cenas &&
          mapaContext?.conteudo.cenas.map((x, i) => (
            <MenuItem value={x.id} key={`select#${i}`}>{x.nome}</MenuItem>))
        }
      </Select>
      <ListItemButton onClick={() => dispatch({ type: "inserindoNovaCena" })}>
        <ListItemText primary="Criar nova cena" />
        <Queue />
      </ListItemButton>
    </FormControl>
    {cenaSelecionada &&
      <ListItem>
        <Formik
          initialValues={cenaSelecionada as elementoPadrao}
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
                    indiceElemento: index,
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
                    (formik.touched.cenaInicio &&
                      formik.errors.cenaInicio)
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
                <Button
                  onClick={() => {
                    dispatch({ type: "fixarCena", id: cenaSelecionada.id });
                  }}
                >
                  Fixar tela
                </Button>
              </Form >
            );
          }}
        </Formik>
      </ListItem >
    }
  </>
  );
}
