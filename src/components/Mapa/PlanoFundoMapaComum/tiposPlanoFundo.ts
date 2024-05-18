import { tipoMapaComum } from "../mapaContextTypes";

const tiposPlanoFundo: tipoMapaComum[] = [
  {
    nome: "OpenStreetMap",
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxNativeZoom: 19,
    maxZoom: 19,
  },
  {
    nome: "Stadia Maps - Alidade Smooth",
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    maxNativeZoom: 18,
    maxZoom: 23,
  },
  {
    nome: "Stadia Maps - Alidade Smooth Dark",
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    maxNativeZoom: 18,
    maxZoom: 23,
  },
  {
    nome: "Stadia Maps - OSM Bright",
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    url: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
    maxNativeZoom: 18,
    maxZoom: 23,
  },
  {
    nome: "Stadia Maps - Stamen Toner",
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    url: "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png",
    maxNativeZoom: 18,
    maxZoom: 23,
  },
  {
    nome: "Stadia Maps - Stamen Watercolor",
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    url: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
    maxNativeZoom: 16,
    maxZoom: 17,
  },
  {
    nome: "Stadia Maps - Stamen Terrain",
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    url: "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png",
    maxNativeZoom: 16,
    maxZoom: 17,
  },
  {
    nome: "Google Maps - Hybrid (Satellite & Streets)",
    attribution: "Map data ©2023",
    url: "http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}",
    maxNativeZoom: 19,
    maxZoom: 23,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  },
  {
    nome: "Google Maps - Streets",
    attribution: "Map data ©2023",
    url: "http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}",
    maxNativeZoom: 19,
    maxZoom: 23,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  },
  {
    nome: "Google Maps - Satellite",
    attribution: "Map data ©2023",
    url: "http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}",
    maxNativeZoom: 19,
    maxZoom: 23,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  },
  {
    nome: "Google Maps - Terrain",
    attribution: "Map data ©2023",
    url: "http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}",
    maxNativeZoom: 19,
    maxZoom: 23,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  },
];
export default tiposPlanoFundo;
