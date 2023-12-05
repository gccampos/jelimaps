import React from "react";
import DefaultTemplate from "@/main/template/DefaultTemplate";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import useCaixaDialogo from "@/components/CaixaDialogo/useCaixaDialogo";

const cards = [
  {
    imageUrl:
      "/assets/tour-pequena-africa-no-rio-de-janeiro-morro-conceicao-rua.jpg",
    nome: "Pequena África",
    descricao: "Processo de diáspora africana num passeio pelo Rio de Janeiro",
    url: "/mapa?pequena-africa",
  },
  {
    imageUrl: "/assets/one-piece.jpeg",
    nome: "One Piece - Saga Alabasta",
    descricao: "Resumo da primeira saga da grand line (não finalizado)",
    url: "/mapa?one-piece",
  },
  // {
  //   imageUrl:
  //     "/assets/tour-pequena-africa-no-rio-de-janeiro-morro-conceicao-rua.jpg",
  //   nome: "Pequena África",
  //   descricao: "Processo de diáspora africana num passeio pelo Rio de Janeiro",
  //   url: "/",
  // },
];
export default function Home() {
  const router = useRouter();
  const { openModalConfirm } = useCaixaDialogo();

  return (
    <DefaultTemplate>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              JeliMaps
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              A JeliMaps é uma plataforma que oferece uma ampla gama de recursos
              para a criação de mapas interativos em uma linha do tempo. Entre
              suas principais funcionalidades, destacam-se:
            </Typography>

            <Grid container spacing={2}>
              <Grid container item xs={12} md={6} spacing={2}>
                <Grid item xs={12}>
                  Criação intuitiva de mapas: A interface amigável da JeliMaps
                  permite aos usuários criar facilmente mapas personalizados em
                  uma linha do tempo. É possível adicionar pontos de interesse,
                  rotas, áreas e outros elementos geográficos de forma rápida e
                  simples.
                </Grid>
                <Grid item xs={12}>
                  Integração de imagens próprias: Os usuários têm a opção de
                  utilizar suas próprias imagens georreferenciadas para
                  enriquecer seus mapas. Isso permite a visualização de dados
                  específicos e a criação de narrativas visuais impactantes.
                </Grid>
              </Grid>
              <Grid container item xs={12} md={6} spacing={2}>
                <Grid item xs={12}>
                  Base OpenStreetMaps: A JeliMaps oferece suporte à integração
                  de mapas da base de dados OpenStreetMaps. Os usuários podem
                  aproveitar os recursos detalhados dessa fonte de informações
                  aberta, permitindo uma representação precisa e atualizada do
                  mundo.
                </Grid>
                <Grid item xs={12}>
                  Linha do tempo interativa: A aplicação permite que os usuários
                  definam datas e intervalos de tempo para a exibição de eventos
                  e dados específicos em seus mapas. Com a funcionalidade da
                  linha do tempo, é possível observar a evolução geográfica ao
                  longo do tempo, analisar mudanças e descobrir padrões.
                </Grid>
              </Grid>
            </Grid>

            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                onClick={() => {
                  if (localStorage.getItem("mapaContext"))
                    openModalConfirm({
                      title: "Você tem um projeto em andamento",
                      message: "Deseja continuar ou começar do zero?",
                      onConfirm: () => {
                        router.push("/mapa?novo");
                      },
                      onCancel: () => {
                        router.push("/mapa");
                      },
                      cancelarTitle: "Continuar um projeto",
                      confirmarTitle: "Começar um novo",
                    });
                  else router.push("/mapa");
                }}
              >
                Começe agora
              </Button>
              <Button variant="outlined" href="#exemplos">
                Veja exemplos
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md" id="exemplos">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={card.imageUrl}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.nome}
                    </Typography>
                    <Typography>{card.descricao}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => router.push(card.url)}>
                      Ver
                    </Button>
                    {/* <Button size="small">Edi</Button> */}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </DefaultTemplate>
  );
}
