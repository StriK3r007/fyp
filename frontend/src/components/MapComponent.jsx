// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { Bus, MapPin } from "lucide-react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";
// import { io } from 'socket.io-client';

// let socket;

// export default function MapComponent() {
//   const [buses, setBuses] = useState([]);
//   const [stops, setStops] = useState([]);

//   useEffect(() => {
//     socket = io('http://localhost:5000');
//     console.log('Connecting to Socket.IO...');

//     socket.on('connect', () => {
//       console.log('Socket.IO connected on frontend!');
//       socket.emit('testEvent', { message: 'Hello server from client!' });
//     });

//     socket.on('testEvent', (data) => {
//       console.log('Received testEvent:', data);
//     });

//     socket.on('busLocationUpdate', ({ driverId, latitude, longitude }) => {
//       console.log('Received busLocationUpdate:', { driverId, latitude, longitude });
//       setBuses(prevBuses =>
//         prevBuses.map(bus => {
//           console.log('Checking bus:', bus);
//           console.log('Bus Driver:', bus.driver);
//           const isMatch = bus.driver && bus.driver.userId === driverId;
//           console.log('User ID Match:', isMatch);
//           if (isMatch) {
//             console.log('Updating bus:', bus._id, 'with location:', latitude, longitude);
//             return { ...bus, currentLocation: { latitude, longitude } };
//           }
//           return bus;
//         })
//       );
//     });

//     const fetchData = async () => {
//       try {
//         const busesRes = await axios.get("/api/buses/public");
//         setBuses(busesRes.data);
//         busesRes.data.forEach(bus => {
//           console.log('Fetched bus:', bus);
//         });
//         const stopsRes = await axios.get("/api/stops/public");
//         setStops(stopsRes.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();

//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []); // Run once on mount and unmount

//   useEffect(() => {
//     console.log('Current buses state:', buses);
//   }, [buses]);

//   return (
//     <MapContainer center={[30.1775, 66.9900]} zoom={15} scrollWheelZoom={true} className="h-screen w-full z-0">
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {console.log('All buses before filter:', buses)}
//       {/* {buses */}
//         {/* .filter(bus => bus.currentLocation && bus.currentLocation.latitude !== null && bus.currentLocation.longitude !== null) */}
//         {/* .map((bus) => { */}
//           {/* console.log('Bus object in map:', bus); */}
//           {/* return ( */}
//             {/* <Marker */}
//               {/* key={bus._id} */}
//               {/* position={[bus.currentLocation.latitude, bus.currentLocation.longitude]} */}
//             {/* > */}
//               {/* <Popup> */}
//                 {/* <Bus className="inline-block mr-2 text-green-400" size={20} /> */}
//               {/*  <strong>{bus.number}</strong><br /> Changed from bus.name to bus.number */}
//                 {/* {console.log('Driver inside Popup:', bus.driver)} */}
//                 {/* Driver Info: {bus.driver ? JSON.stringify(bus.driver) : 'No Driver'} */}
//                 {/* {bus.driver && bus.driver.name && `Driver: ${bus.driver.name}`} */}
//               {/* </Popup> */}
//             {/* </Marker> */}
//           {/* ); */}
//         {/* })} */}
//         {buses
//   .filter(
//     (bus) =>
//       bus.currentLocation &&
//       typeof bus.currentLocation.latitude === 'number' &&
//       typeof bus.currentLocation.longitude === 'number'
//   )
//   .map((bus) => {
//     console.log('Bus with location for marker:', bus._id, bus.currentLocation);
//     return (
//       <Marker
//         key={bus._id}
//         position={[bus.currentLocation.latitude, bus.currentLocation.longitude]}
//       >
//         <Popup>
//           <Bus className="inline-block mr-2 text-green-400" size={20} />
//           <strong>Bus Number: {bus.number}</strong><br />
//           {/* Driver Info: {bus.driver ? JSON.stringify(bus.driver) : 'No Driver'} */}
//           {/* {bus.driver && bus.driver.name && `Driver Name: ${bus.driver.name}`} */}

//           {bus.driver && bus.driver.name && `Driver Name: ${bus.driver.name}`}
//           {!bus.driver?.name && 'No Driver Assigned'}
//         </Popup>
//       </Marker>
//     );
//   })}
//       {stops
//         .filter(stop => stop.location && stop.location.latitude !== undefined && stop.location.longitude !== undefined)
//         .map((stop) => (
//           <Marker
//             key={stop._id}
//             position={[stop.location.latitude, stop.location.longitude]}
//           >
//             <Popup>
//               <MapPin className="inline-block mr-2 text-green-800" size={20} />
//               <strong>{stop.name}</strong>
//             </Popup>
//           </Marker>
//         ))}
//     </MapContainer>
//   );
// }


import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Bus, MapPin, Info } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { io } from 'socket.io-client';

let socket;

function PanToStop({ selectedStop }) {
  const map = useMap();

  useEffect(() => {
    const coords = selectedStop?.location?.coordinates;
    const lat = selectedStop?.location?.latitude;
    const lng = selectedStop?.location?.longitude;

    if (Array.isArray(coords) && coords.length === 2) {
      const [lngCoord, latCoord] = coords;
      if (typeof latCoord === 'number' && typeof lngCoord === 'number') {
        map.flyTo([latCoord, lngCoord], 16, { animate: true });
      }
    } else if (typeof lat === 'number' && typeof lng === 'number') {
      map.flyTo([lat, lng], 16, { animate: true });
    }
    // Else skip pan
  }, [selectedStop, map]);

  return null;
}

// 🔍 Utility to calculate distance in km between two lat/lng pairs
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapComponent({ selectedStop }) {
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);
  const [fallbackMarker, setFallbackMarker] = useState(null);

  useEffect(() => {
    socket = io('http://localhost:5000');
    console.log('Connecting to Socket.IO...');

    socket.on('connect', () => {
      console.log('Socket.IO connected!');
    });

    socket.on('busLocationUpdate', ({ driverId, latitude, longitude }) => {
      setBuses(prev =>
        prev.map(bus =>
          bus.driver?.userId === driverId
            ? { ...bus, currentLocation: { latitude, longitude } }
            : bus
        )
      );
    });

    const fetchData = async () => {
      try {
        const [busRes, stopRes] = await Promise.all([
          axios.get("/api/buses/public"),
          axios.get("/api/stops/public"),
        ]);
        setBuses(busRes.data);
        setStops(stopRes.data);
      } catch (error) {
        console.error("Error fetching buses/stops:", error);
      }
    };

    fetchData();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const coords = selectedStop?.location?.coordinates;
    const lat = selectedStop?.location?.latitude;
    const lng = selectedStop?.location?.longitude;

    // If no valid coordinates, drop fallback marker in center
    if (
      (!Array.isArray(coords) || coords.length < 2) &&
      (typeof lat !== 'number' || typeof lng !== 'number')
    ) {
      setFallbackMarker([30.1775, 66.9900]); // default fallback marker
    } else {
      setFallbackMarker(null); // clear fallback if stop is valid
    }
  }, [selectedStop]);

  const getNearbyBuses = () => {
    if (!selectedStop?.location?.coordinates || selectedStop.location.coordinates.length < 2) return [];

    const [stopLng, stopLat] = selectedStop.location.coordinates;

    return buses
      .filter(bus => bus.currentLocation)
      .map(bus => {
        const distance = getDistanceFromLatLonInKm(
          stopLat,
          stopLng,
          bus.currentLocation.latitude,
          bus.currentLocation.longitude
        );
        return { ...bus, distance };
      })
      .filter(bus => bus.distance < 2) // 🎯 Filter buses within 2 km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  const nearbyBuses = getNearbyBuses();

  return (
    <MapContainer
      center={[30.1775, 66.9900]}
      zoom={15}
      scrollWheelZoom={true}
      className="h-screen w-full z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <PanToStop selectedStop={selectedStop} />

      {/* 🟡 Fallback Marker if coordinates are invalid */}
      {fallbackMarker && (
        <Marker position={fallbackMarker}>
          <Popup>
            <Info className="inline-block mr-2 text-yellow-500" size={20} />
            No coordinates found for this stop.
          </Popup>
        </Marker>
      )}

      {/* 🚍 Bus Markers */}
      {buses
        .filter(bus => bus.currentLocation)
        .map(bus => (
          <Marker
            key={bus._id}
            position={[bus.currentLocation.latitude, bus.currentLocation.longitude]}
          >
            <Popup>
              <Bus className="inline-block mr-2 text-green-400" size={20} />
              <strong>Bus #{bus.number}</strong>
              <br />
              {bus.driver?.name ? `Driver: ${bus.driver.name}` : 'No driver assigned'}
            </Popup>
          </Marker>
        ))}

      {/* 📍 Stop Markers */}
      {stops
        .filter(stop => stop.location)
        .map(stop => (
          <Marker
            key={stop._id}
            position={[stop.location.latitude, stop.location.longitude]}
          >
            <Popup>
              <MapPin className="inline-block mr-2 text-green-800" size={20} />
              <strong>{stop.name}</strong>
            </Popup>
          </Marker>
        ))}

      {/* 🚨 Nearby buses from selected stop */}
      {selectedStop && nearbyBuses.length > 0 && nearbyBuses.map((bus, idx) => (
        <Marker
          key={`nearby-${bus._id}-${idx}`}
          position={[bus.currentLocation.latitude, bus.currentLocation.longitude]}
          icon={L.divIcon({
            className: 'nearby-bus-icon',
            html: `<div style="background:#facc15;color:black;padding:4px 8px;border-radius:6px;font-size:12px;">🚍 Nearby ${bus.distance.toFixed(1)} km</div>`,
          })}
        />
      ))}
    </MapContainer>
  );
}
