import React from "react";
import {
  styled,
  List,
  ListSubheader,
  ListItemIcon,
  Collapse,
  ListItem,
  IconButton,
  ListItemButton,
  TextField,
  Divider,
} from "@mui/material";
import {
  useMapaContext,
  useMapaDispatch,
} from "@/components/Mapa/context/MapaContext";
import {
  Delete,
  ExpandLess,
  ExpandMore,
  Menu,
  Save,
} from "@mui/icons-material";
import { elementos } from "@/main/constants/elementos";

const WrapperStyled = styled("div")``;

export default function Cenas() {
  const mapaContext = useMapaContext();
  const dispatch = useMapaDispatch();

  const handleCollapse = (e, x) => {
    dispatch({ type: "collapse", tipo: x, valorBooleano: e });
  };

  const handleCollapsePropriedades = (tipo, index, collapse) => {
    dispatch({
      type: "collapse",
      tipo: tipo,
      indiceElemento: index,
      valorBooleano: collapse,
    });
  };
  return (
    <List sx={{ overflow: "auto", height: "100%", pt: 0 }} key={"lista"}>
      {mapaContext?.conteudo &&
        Object.keys(mapaContext?.conteudo).map(
          (x, i) =>
            mapaContext?.conteudo[x]?.length > 0 && (
              <WrapperStyled key={`Wrapper#${x}-${i}`}>
                <ListSubheader
                  onClick={() =>
                    handleCollapse(!mapaContext?.conteudo[x].collapse, x)
                  }
                >
                  <ListItemIcon sx={{ display: "inline-block" }}>
                    {elementos[x].icon}
                  </ListItemIcon>
                  {x + "s"}
                  {!mapaContext?.conteudo[x].collapse ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListSubheader>
                <Collapse
                  in={!mapaContext?.conteudo[x].collapse}
                  className={x}
                  timeout="auto"
                  unmountOnExit
                >
                  {mapaContext?.conteudo[x].map((z, il) => (
                    <>
                      <ListItem
                        key={`ListItem#${z}-${il}`}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              dispatch({
                                type: "removeElement",
                                tipo: z.dataRef,
                                indiceElemento: il,
                                nomeElemento: z.nome,
                              });
                            }}
                          >
                            <Delete />
                          </IconButton>
                        }
                      >
                        <ListItemButton
                          onClick={() =>
                            handleCollapsePropriedades(x, il, !z.collapse)
                          }
                        >
                          <ListItemIcon>
                            <Menu />
                            {z.nome}
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                      {!z.collapse && (
                        <ListItem>
                          <Collapse
                            in={!z.collapse}
                            timeout="auto"
                            unmountOnExit
                          >
                            <form
                              onSubmit={(event) => {
                                console.log("onsubmit", event);
                                //handleEditarPropriedade(event, z);
                              }}
                            >
                              <TextField
                                multiline
                                defaultValue={z.texto}
                                label="Texto"
                                name="texto"
                              />
                              <IconButton type="submit">
                                <Save />
                              </IconButton>
                            </form>
                          </Collapse>
                        </ListItem>
                      )}
                    </>
                  ))}
                </Collapse>
                <Divider />
              </WrapperStyled>
            )
        )}
    </List>
  );
}
