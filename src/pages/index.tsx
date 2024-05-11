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
import Image from "next/image";
import { Chip } from "@mui/material";

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
  {
    imageUrl: "/assets/OIP.jpeg",
    nome: "Golpe de 64",
    descricao:
      "Baseado em informações do documentário o dia que durou 21 anos e dados da Wikipedia",
    url: "/mapa?golpe-64",
  },
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
            pt: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            JeliMaps
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "background.paper",
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            {/* <Stack
              sx={{ py: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
              maxWidth="md"
            > */}
            {/* </Stack> */}
            <Stack
              sx={{ py: 4 }}
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
              <Button
                variant="contained"
                href="https://icltank.com.br/jelimaps/"
                color="warning"
                target="_blank"
              >
                Vote JeliMaps no ICL Tank
              </Button>
              <Button variant="outlined" href="#exemplos">
                Veja exemplos
              </Button>
            </Stack>
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
                  <div
                    style={{ position: "relative", paddingBottom: "56.25%" }}
                  >
                    <iframe
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                      src="https://embed.app.guidde.com/playbooks/jRGUaXDj6KvBG8x1Sn1nQp"
                      title="Criação intuitiva de mapas"
                      referrerPolicy="unsafe-url"
                      allowFullScreen={true}
                      allow="clipboard-write"
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
                    ></iframe>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  Integração de imagens próprias: Os usuários têm a opção de
                  utilizar suas próprias imagens georreferenciadas para
                  enriquecer seus mapas. Isso permite a visualização de dados
                  específicos e a criação de narrativas visuais impactantes.
                  <div
                    style={{ position: "relative", paddingBottom: "56.25%" }}
                  >
                    <iframe
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                      src="https://embed.app.guidde.com/playbooks/wujX3bgVH8wAeFrcdfcbtt"
                      title="Integração de imagens próprias"
                      referrerPolicy="unsafe-url"
                      allow="clipboard-write"
                      allowFullScreen={true}
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
                    ></iframe>
                  </div>
                </Grid>
              </Grid>
              <Grid container item xs={12} md={6} spacing={2}>
                <Grid item xs={12}>
                  Base OpenStreetMaps: A JeliMaps oferece suporte à integração
                  de mapas da base de dados OpenStreetMaps. Os usuários podem
                  aproveitar os recursos detalhados dessa fonte de informações
                  aberta, permitindo uma representação precisa e atualizada do
                  mundo.
                  <div
                    style={{ position: "relative", paddingBottom: "56.25%" }}
                  >
                    <iframe
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                      src="https://embed.app.guidde.com/playbooks/x7UruBwgYCZnwhhDqZ8Yvi"
                      title="Base OpenStreetMaps"
                      referrerPolicy="unsafe-url"
                      allow="clipboard-write"
                      allowFullScreen={true}
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
                    ></iframe>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  Linha do tempo interativa: A aplicação permite que os usuários
                  definam datas e intervalos de tempo para a exibição de eventos
                  e dados específicos em seus mapas. Com a funcionalidade da
                  linha do tempo, é possível observar a evolução geográfica ao
                  longo do tempo, analisar mudanças e descobrir padrões.
                  <div
                    style={{ position: "relative", paddingBottom: "56.25%" }}
                  >
                    <iframe
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                      src="https://embed.app.guidde.com/playbooks/v1AfJB3y8KTiUGpVwcGXzw"
                      title="Linha do tempo interativa"
                      referrerPolicy="unsafe-url"
                      allow="clipboard-write"
                      allowFullScreen={true}
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
                    ></iframe>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Box
          sx={{
            // bgcolor: "#1976d257",
            backgroundImage: "linear-gradient(white, #1976d257)",
            pt: 8,
            pb: 6,
          }}
          id="exemplos"
        >
          <Container sx={{ py: 8 }} maxWidth="md">
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
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => router.push(card.url)}
                      >
                        Ver
                      </Button>
                      {/* <Button size="small">Edi</Button> */}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        <Box
          sx={{
            pt: 4,
            pb: 4,
            backgroundImage: "linear-gradient(#1976d257, #1976d2)",
            // bgcolor: "#1976d2",
            ":hover": {
              bgcolor: "#2020ff",
              ".chip-voto": { bgcolor: "#d5de22" },
              cursor: "pointer",
            },
            alignContent: "center",
            ".chip-voto": { bgcolor: "#eff5fb" },
          }}
          onClick={() => {
            window.open("https://icltank.com.br/jelimaps/");
          }}
        >
          <Stack direction="column" spacing={2} justifyContent="center">
            <Typography
              component="h6"
              variant="h5"
              align="center"
              color="text.primary"
              gutterBottom
              marginX={10}
            >
              Este projeto está participando do
            </Typography>
            <Image
              src="https://icltank.b-cdn.net/wp-content/themes/landing/images/tank/logo-icl-tank-branco.png"
              width="600"
              height="200"
              className="width-350px xs-width-70 m-40px-b"
              alt="Logo ICL Tank"
              sizes="100vw"
              style={{
                width: "70%",
                height: "auto",
                margin: "auto",
              }}
            />
            <Stack>
              <Chip
                label="Vote aqui"
                className="chip-voto"
                sx={{ width: "50%", margin: "auto" }}
              />
            </Stack>
          </Stack>
        </Box>
      </main>
    </DefaultTemplate>
  );
}
