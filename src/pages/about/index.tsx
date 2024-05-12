import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import DefaultTemplate from "@/main/template/DefaultTemplate";

const equipe = [
  {
    nome: "Guilherme Campos",
    foto: "/assets/guilherme.jpg",
    descricao:
      "Estudante de Sistemas de Informação, com interesse em desenvolvimento web e dados abertos",
    git: "http://github.com/gccampos",
    email: "mailto:gcordeiro@id.uff.br",
  },
  {
    nome: "Danilo Siqueira",
    foto: "/assets/danilo.jpg",
    descricao:
      "Estudante de Sistemas de Informação, com interesse em desenvolvimento e segurança da informação",
    git: "http://github.com/siqueirad",
    email: "mailto:danilo_siqueira@id.uff.br",
  },
];

const About = () => {
  return (
    <DefaultTemplate>
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" align="center" color="text.primary">
              Os Jelis
            </Typography>
            <Typography align="center">
              Griô ou griote na forma feminina, e também chamados jali ou jeli,
              é o indivíduo que na África Ocidental tem por vocação preservar e
              transmitir as histórias, conhecimentos, canções e mitos do seu
              povo. Existem griôs músicos e griôs contadores de histórias.
              Ensinam a arte, o conhecimento de plantas, tradições, histórias e
              aconselhavam membros das famílias reais. (Fonte:{" "}
              {<a href="https://pt.wikipedia.org/wiki/Gri%C3%B4">Wikipedia</a>})
            </Typography>
            <br></br>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Sobre o Projeto
            </Typography>
            <Typography align="center">
              A JeliMaps é uma plataforma que oferece uma ampla gama de recursos
              para a criação de mapas interativos em uma linha do tempo. Também
              utilizado como projeto de aplicação, atendendo como requisito
              parcial para conclusão do curso de Sistemas de Informação da
              Universidade Federal Fluminense.
            </Typography>
            <br></br>
            <Typography variant="h3" align="center" color="text.primary">
              Quem Somos?
            </Typography>
            <Grid container spacing={4} justifyContent={"center"}>
              {equipe.map((membro) => (
                <Grid item key={membro.nome} xs={12} sm={6} md={4}>
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
                      image={membro.foto}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {membro.nome}
                      </Typography>
                      <Typography>{membro.descricao}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" href={membro.git}>
                        Github
                      </Button>
                      <Button size="small" href={membro.email}>
                        Contato
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </main>
    </DefaultTemplate>
  );
};

export default About;
