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

const { default: DefaultTemplate } = require("@/main/template/DefaultTemplate");
const { default: React } = require("react");

const About = () => {
  const cards = [1, 2];
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
          <Container maxWidth="sm">
            <Typography variant="h3" align="center" color="text.primary" >
              Os Jelis
            </Typography>
            <Typography align="center">
              Griô ou griote na forma feminina, e também chamados jali ou jeli, é o
              indivíduo que na África Ocidental tem por vocação preservar e
              transmitir as histórias, conhecimentos, canções e mitos do seu
              povo. Existem griôs músicos e griôs contadores de histórias.
              Ensinam a arte, o conhecimento de plantas, tradições, histórias e
              aconselhavam membros das famílias reais.
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
            <Typography variant="h3" align="center" color="text.primary">
              Quem Somos?
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={14} sm={8} md={6}>
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
                      image="https://source.unsplash.com/random?wallpapers"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Danilo Siqueira
                      </Typography>
                      <Typography>
                        Estudante de Sistemas de Informação, com interesse em
                        desenvolvimento front end.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" href="http://github.com/siqueirad">Github</Button>
                      <Button size="small" href="mailto:danilo_siqueira@id.uff.br">Contato</Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={14} sm={8} md={6}>
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
                      image="https://source.unsplash.com/random?wallpapers"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Guilherme Campos
                      </Typography>
                      <Typography>
                        Estudante de Sistemas de Informação, com interesse em
                        .
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" href="http://github.com/gccampos">Github</Button>
                      <Button size="small" href="mailto:gcordeiro@id.uff.br">Contato</Button>
                    </CardActions>
                  </Card>
                </Grid>
              
            </Grid>
          </Container>
        </Box>
      </main>
    </DefaultTemplate>
  );
};

export default About;
