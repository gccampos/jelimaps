import { Paper, Slider } from "@mui/material";
import { useMapaContext, useMapaDispatch } from "./MapaContext";
import contextChangers from "./ContextChangers";
import moment from "moment";

const SliderLinhaTempo = (propsSlider: { isMobile?: boolean }) => {
  const { isMobile } = propsSlider;
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();
  return (
    <Paper
      sx={{
        p: "2vw",
        ...(isMobile ? { ml: "20px" } : { mx: "100px" }),
        mb: "1vw",
      }}
      elevation={23}
    >
      <Slider
        value={new Date(mapaContext.tempo).getTime()}
        name=""
        min={new Date(mapaContext.conteudo.cenas[0].cenaInicio).getTime()}
        step={1}
        marks={contextChangers
          .retornaListaTemposConteudo(mapaContext)
          .map((x) => {
            return {
              value: new Date(x).getTime(),
              label: "",
            };
          })}
        max={new Date(
          mapaContext.conteudo.cenas[
            mapaContext.conteudo.cenas.length - 1
          ].cenaFim
        ).getTime()}
        onChangeCommitted={(e, checked) => {
          dispatch({
            type: "atualizaTempo",
            time: moment(checked).format("yyyy-MM-DDTHH:mm:ss"),
          });
        }}
        valueLabelFormat={() => {
          return (
            <>{moment(mapaContext.tempo).format("DD/MM/yyyy  hh:mm:ss")}</>
          );
        }}
        valueLabelDisplay="on"
        aria-labelledby="non-linear-slider"
      />
    </Paper>
  );
};
export default SliderLinhaTempo;
