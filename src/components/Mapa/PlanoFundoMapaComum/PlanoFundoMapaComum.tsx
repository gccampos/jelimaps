import { TileLayer } from "react-leaflet";
import { useMapaContext } from "../MapaContext";
import CustomControlLeaflet, {
  POSITION_CLASSES_CUSTOM_CONTROL,
} from "../../CustomControlLeaflet/CustomControlLeaflet";
import Image from "next/image";
import useWindowDimensions from "../../Studio/useWindowDimensions";

const PlanoFundoMapaComum = () => {
  const mapaContext = useMapaContext();
  const { height, width } = useWindowDimensions();
  if (mapaContext.tipoMapaComum)
    return (
      <>
        <TileLayer {...mapaContext.tipoMapaComum} />
        {mapaContext.tipoMapaComum.url.includes("google.com/vt") && (
          <CustomControlLeaflet
            position={POSITION_CLASSES_CUSTOM_CONTROL.bottomleft}
          >
            <Image
              src={"/assets/google_on_white.png"}
              alt="logo google"
              width={width * 0.07 > 60 ? 60 : width * 0.07}
              height={height * 0.05 > 20 ? 20 : height * 0.05}
            />
          </CustomControlLeaflet>
        )}
      </>
    );
  return (
    <>
      <TileLayer
        attribution="Map data ©2023"
        url="http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}"
        maxNativeZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
        maxZoom={23}
      />
      <CustomControlLeaflet
        position={POSITION_CLASSES_CUSTOM_CONTROL.bottomleft}
      >
        <Image
          src={"/assets/google_on_white.png"}
          alt="logo google"
          width={width * 0.07 > 60 ? 60 : width * 0.07}
          height={height * 0.05 > 20 ? 20 : height * 0.05}
        />
      </CustomControlLeaflet>
    </>
  );
};

export default PlanoFundoMapaComum;
