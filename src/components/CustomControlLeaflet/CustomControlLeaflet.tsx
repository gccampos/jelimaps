import React from "react";

export const POSITION_CLASSES_CUSTOM_CONTROL = {
  bottomleft: "bottomleft",
  bottomright: "bottomright",
  topleft: "topleft",
  topright: "topright",
};

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

export default function CustomControlLeaflet({
  position,
  children,
  classCustom,
}: {
  position?: any;
  children: any;
  classCustom?: any;
}) {
  const positionClass = position && POSITION_CLASSES[position];
  return (
    <div className={positionClass}>
      <div
        className={
          classCustom ?? "leaflet-control leaflet-bar leaflet-speeddial"
        }
      >
        {children}
      </div>
    </div>
  );
}
