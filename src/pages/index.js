import Image from 'next/image'
import { Inter } from 'next/font/google'
import React from 'react'
import DefaultTemplate from '@/main/template/DefaultTemplate'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import PublicIcon from '@mui/icons-material/Public';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, ListItem, ListItemText } from "@mui/material";
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })
const cards = [1, 2, 3, 4]
export default function Home() {
  const router = useRouter();
  return (
    <DefaultTemplate>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              JeliMaps
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              A JeliMaps é uma plataforma que oferece uma ampla gama de recursos para a criação de mapas interativos em uma linha do tempo. Entre suas principais funcionalidades, destacam-se:
            </Typography>

            <Grid container spacing={2}>
              <Grid container item xs={12} md={6} spacing={2}>
                <Grid item xs={12}>
                  Criação intuitiva de mapas: A interface amigável da JeliMaps permite aos usuários criar facilmente mapas personalizados em uma linha do tempo. É possível adicionar pontos de interesse, rotas, áreas e outros elementos geográficos de forma rápida e simples.
                </Grid>
                <Grid item xs={12}>
                  Integração de imagens próprias: Os usuários têm a opção de utilizar suas próprias imagens georreferenciadas para enriquecer seus mapas. Isso permite a visualização de dados específicos e a criação de narrativas visuais impactantes.
                </Grid>
              </Grid>
              <Grid container item xs={12} md={6} spacing={2}>
                <Grid item xs={12}>
                  Base OpenStreetMaps: A JeliMaps oferece suporte à integração de mapas da base de dados OpenStreetMaps. Os usuários podem aproveitar os recursos detalhados dessa fonte de informações aberta, permitindo uma representação precisa e atualizada do mundo.
                </Grid>
                <Grid item xs={12}>
                  Linha do tempo interativa: A aplicação permite que os usuários definam datas e intervalos de tempo para a exibição de eventos e dados específicos em seus mapas. Com a funcionalidade da linha do tempo, é possível observar a evolução geográfica ao longo do tempo, analisar mudanças e descobrir padrões.
                </Grid>

              </Grid>
            </Grid>


            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={() => router.push('/mapa')}>Começe agora</Button>
              <Button variant="outlined" href='#exemplos'>Veja exemplos</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md" id="exemplos">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the
                      content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </DefaultTemplate>
  )
}
