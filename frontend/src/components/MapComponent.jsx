import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Bus, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { io } from 'socket.io-client';

let socket;

export default function MapView() {
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    socket = io('http://localhost:5000');
    console.log('Connecting to Socket.IO...');

    socket.on('connect', () => {
      console.log('Socket.IO connected on frontend!');
      socket.emit('testEvent', { message: 'Hello server from client!' });
    });

    socket.on('testEvent', (data) => {
      console.log('Received testEvent:', data);
    });

    socket.on('busLocationUpdate', ({ driverId, latitude, longitude }) => {
      console.log('Received busLocationUpdate:', { driverId, latitude, longitude });
      setBuses(prevBuses =>
        prevBuses.map(bus => {
          console.log('Checking bus:', bus);
          console.log('Bus Driver:', bus.driver);
          const isMatch = bus.driver && bus.driver.userId === driverId;
          console.log('User ID Match:', isMatch);
          if (isMatch) {
            console.log('Updating bus:', bus._id, 'with location:', latitude, longitude);
            return { ...bus, currentLocation: { latitude, longitude } };
          }
          return bus;
        })
      );
    });

    const fetchData = async () => {
      try {
        const busesRes = await axios.get("/api/buses/public");
        setBuses(busesRes.data);
        busesRes.data.forEach(bus => {
          console.log('Fetched bus:', bus);
        });
        const stopsRes = await axios.get("/api/stops/public");
        setStops(stopsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Run once on mount and unmount

  useEffect(() => {
    console.log('Current buses state:', buses);
  }, [buses]);

  return (
    <MapContainer center={[30.1775, 66.9900]} zoom={15} className="h-screen w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {console.log('All buses before filter:', buses)}
      {/* {buses */}
        {/* .filter(bus => bus.currentLocation && bus.currentLocation.latitude !== null && bus.currentLocation.longitude !== null) */}
        {/* .map((bus) => { */}
          {/* console.log('Bus object in map:', bus); */}
          {/* return ( */}
            {/* <Marker */}
              {/* key={bus._id} */}
              {/* position={[bus.currentLocation.latitude, bus.currentLocation.longitude]} */}
            {/* > */}
              {/* <Popup> */}
                {/* <Bus className="inline-block mr-2 text-green-400" size={20} /> */}
              {/*  <strong>{bus.number}</strong><br /> Changed from bus.name to bus.number */}
                {/* {console.log('Driver inside Popup:', bus.driver)} */}
                {/* Driver Info: {bus.driver ? JSON.stringify(bus.driver) : 'No Driver'} */}
                {/* {bus.driver && bus.driver.name && `Driver: ${bus.driver.name}`} */}
              {/* </Popup> */}
            {/* </Marker> */}
          {/* ); */}
        {/* })} */}
        {buses
  .filter(
    (bus) =>
      bus.currentLocation &&
      typeof bus.currentLocation.latitude === 'number' &&
      typeof bus.currentLocation.longitude === 'number'
  )
  .map((bus) => {
    console.log('Bus with location for marker:', bus._id, bus.currentLocation);
    return (
      <Marker
        key={bus._id}
        position={[bus.currentLocation.latitude, bus.currentLocation.longitude]}
      >
        <Popup>
          <Bus className="inline-block mr-2 text-green-400" size={20} />
          <strong>Bus Number: {bus.number}</strong><br />
          {/* Driver Info: {bus.driver ? JSON.stringify(bus.driver) : 'No Driver'} */}
          {/* {bus.driver && bus.driver.name && `Driver Name: ${bus.driver.name}`} */}

          {bus.driver && bus.driver.name && `Driver Name: ${bus.driver.name}`}
          {!bus.driver?.name && 'No Driver Assigned'}
        </Popup>
      </Marker>
    );
  })}
      {stops
        .filter(stop => stop.location && stop.location.latitude !== undefined && stop.location.longitude !== undefined)
        .map((stop) => (
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
    </MapContainer>
  );
}