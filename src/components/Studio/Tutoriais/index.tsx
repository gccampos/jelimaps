import { useShepherdTour } from "react-shepherd";
import stepsShepherdTour from "./stepsShepherdTour";
import "react-shepherd/node_modules/shepherd.js/dist/css/shepherd.css";
import { useEffect } from "react";
import { useMapaContext } from "@/components/Mapa/MapaContext";

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
};

const Tutoriais = () => {
  const mapaContext = useMapaContext();
  const tour = useShepherdTour({ tourOptions, steps: stepsShepherdTour });
  useEffect(() => {
    if (localStorage.getItem("tourFinalizado"))
      if (mapaContext.modoVisao === "OpenStreetMap") tour.start();
  }, [tour, mapaContext.modoVisao]);

  return null;
};
export default Tutoriais;
