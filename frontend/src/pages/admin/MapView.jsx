import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Bus,  MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { io } from 'socket.io-client'; // Import the client

// const busIcon = new L.Icon({
//   iconUrl: "/bus-icon.png",
//   iconSize: [30, 30],
// });

// const stopIcon = new L.Icon({
//   iconUrl: "/stop-icon.png",
//   iconSize: [25, 25],
// });

export default function MapView() {
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);

  // Fetch buses and stops from backend
  useEffect(() => {
    const socket = io('http://localhost:5000');

    const fetchData = async () => {
      try {
        const [busesRes, stopsRes] = await Promise.all([
          axios.get("/api/buses/public"),
          axios.get("/api/stops/public"),
        ]);
        setBuses(busesRes.data);
        setStops(stopsRes.data);

        socket.on('busLocationUpdate', ({ driverId, latitude, longitude }) => {
          // Update marker position in map state
          setBuses(prevBuses =>
            prevBuses.map(bus =>
              bus.driverId === driverId ? { ...bus, location: { ...bus.location, latitude, longitude } } : bus
            )
          );
          console.log(`Bus ${driverId} updated to: Lat ${latitude}, Lng ${longitude}`);
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // Cleanup function to disconnect the socket when the component unmounts
    return () => socket.disconnect();
    /*
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    */
  }, []);

  return (
    <MapContainer center={[30.1798, 66.9750]} zoom={13} className="h-screen w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {buses.map((bus) => (
        <Marker
          key={bus._id}
          position={[bus.location.latitude, bus.location.longitude]}
        //   icon={busIcon}
        >
          <Popup>
            <Bus className="inline-block mr-2" size={20} />
            <strong>{bus.name}</strong><br />
            Driver: {bus.driverName}
          </Popup>
        </Marker>
      ))}
      {stops.map((stop) => (
        <Marker
          key={stop._id}
          position={[stop.location.latitude, stop.location.longitude]}
        //   icon={stopIcon}
        >
          <Popup>
            <MapPin className="inline-block mr-2" size={20} />
            <strong>{stop.name}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
