import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ImageOverlay } from 'react-leaflet'
import { LatLngBounds, LatLng } from 'leaflet'
import { useEffect, useState } from 'react'
import React from 'react'
import CustomControlLeaftlet from '@/components/CustomControlLeaftlet/CustomControlLeaftlet'
import { Dropdown } from 'react-bootstrap';

const MODO_VISAO = {
  openstreetmap: 'OpenStreetMap',
  rpg: 'RPG',
  //paintball: 'Paintball',
}

export default function Teste() {
  const [map, setMap] = useState(null)
  const [modoVisao, setModoVisao] = useState(MODO_VISAO.rpg)
  const position = modoVisao === MODO_VISAO.openstreetmap ? [-22.884735317908625, -43.25314700603486] : [0.5, 0.75]


  function LocationMarker() {
    const [position, setPosition] = useState(null)
    useMapEvents({
      click(e) {
        setPosition(e.latlng)
        console.log(e.latlng)
      },
    })

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  useEffect(() => { if (map != null) map.setView(center, zoom) }, [modoVisao])

  const bounds = new LatLngBounds([0, 0], [1, 1.5])

  const center = new LatLng(position[0], position[1])
  const zoom = modoVisao === MODO_VISAO.openstreetmap ? 13 : 9
  return (
    <MapContainer center={center} zoom={zoom} ref={setMap} >
      {
        modoVisao === MODO_VISAO.openstreetmap &&
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      }
      {
        modoVisao === MODO_VISAO.rpg &&
        <ImageOverlay
          bounds={bounds}
          url='/new-map.jpg'
        />
      }
      <CustomControlLeaftlet position={'topright'}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Alterne entre modos de visão
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#" onClick={() => setModoVisao(MODO_VISAO.openstreetmap)}>{MODO_VISAO.openstreetmap}</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => setModoVisao(MODO_VISAO.rpg)}>{MODO_VISAO.rpg}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </CustomControlLeaftlet>
      {
        modoVisao === MODO_VISAO.openstreetmap &&
        <Marker position={center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      }
      <LocationMarker />
    </MapContainer>)
}