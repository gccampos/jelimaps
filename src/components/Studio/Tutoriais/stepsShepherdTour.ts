import { ShepherdOptionsWithType } from "react-shepherd";

const stepsShepherdTour: Array<ShepherdOptionsWithType> = [
  {
    attachTo: { element: ".item-list-interacao-marker", on: "bottom" },
    advanceOn: { selector: ".item-list-interacao-marker", event: "click" },
    cancelIcon: {
      enabled: true,
    },
    title: "Clique aqui para inserir um marcador no mapa!",
    text: ["Faça o tutorial até o final. \n"],
  },
  {
    attachTo: { element: "#idMapa", on: "bottom" },
    advanceOn: { selector: "#idMapa", event: "click" },
    cancelIcon: {
      enabled: true,
    },
    title: "Clique em alguma parte do mapa",
    text: ["Selecione onde o marcador deve ser inserido."],
  },
  {
    beforeShowPromise: () => {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve("");
        }, 500);
      });
    },
    classes: "mt-3",
    attachTo: {
      element: `.icon-marker > svg`,
      on: "bottom",
    },
    advanceOn: {
      selector: `.icon-marker > svg`,
      event: "click",
    },
    cancelIcon: {
      enabled: true,
    },
    title: "Clique no marcador no mapa",
    text: ["Selecione o marcador do mapa para editar suas propriedades."],
  },
  {
    attachTo: { element: "#botaoTR", on: "bottom" },
    advanceOn: { selector: "#botaoTR", event: "click" },
    cancelIcon: {
      enabled: true,
    },
    title: "Clique para abrir a aba de configurações!",
    text: ["Aqui você pode abrir ou fechar a aba de configurações."],
  },
  {
    attachTo: { element: "#foraDIv", on: "left" },
    beforeShowPromise: () => {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve("");
        }, 500);
      });
    },
    buttons: [
      // {
      //   classes: "shepherd-button-secondary",
      //   text: "Fim",
      //   type: "cancel",
      // },
      // {
      //   classes: 'shepherd-button-primary',
      //   text: 'Back',
      //   type: 'back'
      // },
      {
        classes: "shepherd-button-primary",
        text: "Proximo",
        type: "next",
      },
    ],
    cancelIcon: {
      enabled: true,
    },
    classes: "-ml-10",
    title: "Aba de configurações!",
    text: [
      "Aqui você pode editar as propriedades do elemento selecionado ou do projeto em si, além de adicionar e editar as cenas da apresentação.",
    ],
  },
  {
    attachTo: { element: ".personalized-scrollbar", on: "top" },
    beforeShowPromise: () => {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve("");
        }, 500);
      });
    },
    buttons: [
      {
        classes: "shepherd-button-secondary",
        text: "Fim",
        type: "cancel",
      },
    ],
    cancelIcon: {
      enabled: true,
    },
    classes: "-mt-10",
    title: "Esta é a linha do tempo!",
    text: [
      "Aqui você pode editar quando os elementos devem aparecer seguindo o tempo inicio e fim do projeto.",
    ],
    when: {
      cancel: () => {
        localStorage.setItem("tourFinalizado", "true");
      },
    },
  },
];

export default stepsShepherdTour;
