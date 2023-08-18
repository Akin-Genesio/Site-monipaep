import { useState, useEffect, useRef, useMemo } from 'react'
import { MapContainer, Marker, Popup } from 'react-leaflet'
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer'
import { MapMarkerIcon } from './MapMarkerIcon'

import 'leaflet/dist/leaflet.css'

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

type Location = {
  lat: number;
  lng: number;
}

interface DraggableMarkerProps {
  initialPosition: Location
  updatePosition: (position: Location) => void
}

interface MapProps {
  center: Location;
  updatePosition: (position: Location) => void
}

function DraggableMarker({ initialPosition, updatePosition }: DraggableMarkerProps) {
  const [position, setPosition] = useState(initialPosition)
  const markerRef = useRef(null)

  useEffect(() => { setPosition(initialPosition) }, [initialPosition])

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker: any = markerRef.current
      if (marker != null) {
        const position = marker.getLatLng()
        setPosition(position)
        updatePosition(position)
      }
    },
  }), [updatePosition])

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={MapMarkerIcon}
    >
      <Popup>
        Unidade de saúde
      </Popup>
    </Marker>
  )
}

export default function Map({ center, updatePosition }: MapProps) {
  return (
    <>
      <MapContainer center={center} zoom={16} scrollWheelZoom style={{ height: 300, width: "100%" }}>
        <ReactLeafletGoogleLayer googleMapsLoaderConf={{ apiKey }}/>
        <DraggableMarker initialPosition={center} updatePosition={updatePosition}/>
      </MapContainer>
    </>
  )
}