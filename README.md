# JeliMaps

JeliMaps é uma aplicação web que permite criar mapas interativos e conectados a uma linha do tempo

## Executando

Para executar o programa em local de desenvolvimento, você precisa ter instalado o Node.js e o npm na sua máquina. Depois, siga os seguintes passos:

1. Clone o repositório do projeto no GitHub: `git clone https://github.com/gccampos/jelimaps.git`
2. Entre na pasta do projeto: `cd jelimaps`
3. Instale as dependências do projeto: `npm install`
4. Execute o comando `npm run dev` para iniciar o servidor de desenvolvimento
5. Abra o seu navegador e acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação rodando

## Mais informações

As tecnologias utilizadas foram:

- [React](https://react.dev/) - A biblioteca para interfaces de usuário web e nativas.
- [Next.js](https://nextjs.org/) - Um framework react otimizado para Web.
- [Material-UI](https://mui.com/material-ui/) - Componentes de Material Design prontos para uso.
- [Leaflet](https://leafletjs.com/) - Biblioteca para interação com mapas.
  - [OpenStreetMap](https://www.openstreetmap.org/) - Fornecedor de mapas colaborativo.
  - [Leaflet.ImageOverlay.Rotated](https://ivansanchez.github.io/Leaflet.ImageOverlay.Rotated/) - Biblioteca para girar e torcer imagens em mapas.
- [Terra Draw](https://terradraw.io/) - Adaptador de geojson para bibliotecas de interação com mapas.
- [vis-timeline](https://visjs.github.io/vis-timeline/docs/timeline/) - Biblioteca de visualização e interação de dados no tempo.

## Licença

Projeto com licença [GNU General Public License v3.0](https://github.com/gccampos/jelimaps/blob/main/LICENSE)
