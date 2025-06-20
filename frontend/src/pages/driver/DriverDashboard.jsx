import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const DriverDashboard = () => {
  const [user, setUser] = useState(null);
  // const [assignedBus, setAssignedBus] = useState(null);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [socket, setSocket] = useState(null);

  // Log the state values every time the component re-renders
  console.log('DriverDashboard - Current User State:', user);
  // console.log('DriverDashboard - Current Assigned Bus State:', assignedBus);


  useEffect(() => {
    // Fetch logged-in driver details
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API /api/auth/me response:', res.data); // Log response from auth/me
        setUser(res.data);

        /* no need of it
        // If user has an assigned bus, you can optionally fetch its info
        if (res.data.assignedBus) {
          console.log('User has assignedBus ID:', res.data.assignedBus._id || res.data.assignedBus); // Log the ID being used
          const busRes = await axios.get(`/api/buses/${res.data.assignedBus._id || res.data.assignedBus}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('API /api/buses/:id response:', busRes.data); // Log response from buses/:id
          setAssignedBus(busRes.data);
        } else {
          console.log('User does NOT have an assignedBus in /api/auth/me response.');
          setAssignedBus(null); // Explicitly set to null if no bus is assigned
        }
          */

      } catch (error) {
        console.error('Error fetching driver info:', error);
        console.log('Full error from /api/auth/me:', error); // Log the full error object
      }
    };

    fetchUser();
    return () => {
      if (socket) socket.disconnect();
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleToggleLocation = () => {
    // setSharingLocation(prev => !prev);
    // (To be implemented next step: Start/stop sharing via geolocation)
    // if (!assignedBus) {
    // alert('You need to be assigned a bus before sharing location.');
    // return;
  // }
  if (!user?.assignedBus) { // Use user.assignedBus
      alert('You need to be assigned a bus before sharing location.');
      return;
    }

  // const token = localStorage.getItem('token');

  // if (!sharingLocation) {
  //   const newSocket = io('http://localhost:5000');
  //   setSocket(newSocket);
    
  //   const id = navigator.geolocation.watchPosition(
  //     async (position) => {
  //       try {
  //         const { latitude, longitude } = position.coords;

  //         await axios.post(`/api/buses/${assignedBus._id}/location`, {
  //           latitude,
  //           longitude,
  //         }, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });

  //         console.log('Location sent:', latitude, longitude);
  //       } catch (error) {
  //         console.error('Error sending location:', error);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error getting location:', error);
  //       alert('Please allow location access.');
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       maximumAge: 0,
  //       timeout: 5000,
  //     }
  //   );
  
  if (!sharingLocation) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          newSocket.emit('locationUpdate', {
            driverId: user._id,
            latitude,
            longitude,
            busId: user.assignedBus._id // Make sure to send the busId for the update
          });
          console.log('Socket location sent:', latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Please allow location access.');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

    setWatchId(id);
    setSharingLocation(true);
  } else {
    if (socket) socket.disconnect();
    navigator.geolocation.clearWatch(watchId);
    setWatchId(null);
    setSharingLocation(false);
    setSocket(null);
    console.log('Stopped sharing location');
  }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      {user && <p className="mb-2">Welcome, {user.name}</p>}

      {user?.assignedBus ? (
        <div className="mb-4 p-4 border rounded shadow">
          <h2 className="font-semibold">Assigned Bus</h2>
          <p>Bus Number: {user.assignedBus.number}</p>
          <p>Route: {user.assignedBus.route || 'N/A'}</p>
        </div>
      ) : (
        <p className="mb-4">No bus assigned to you yet.</p>
      )}

      <button
        onClick={handleToggleLocation}
        className={`px-4 py-2 rounded text-white ${sharingLocation ? 'bg-red-500' : 'bg-green-600'}`}
      >
        {sharingLocation ? 'Stop Sharing Location' : 'Start Sharing Location'}
      </button>
    </div>
  );
};

export default DriverDashboard;

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
//       {user && <p className="mb-2">Welcome, {user.name}</p>}

//       {assignedBus ? (
//         <div className="mb-4 p-4 border rounded shadow">
//           <h2 className="font-semibold">Assigned Bus</h2>
//           <p>Bus Number: {assignedBus.busNumber}</p>
//           <p>Route: {assignedBus.route || 'N/A'}</p>
//         </div>
//       ) : (
//         <p className="mb-4">No bus assigned to you yet.</p>
//       )}

//       <button
//         onClick={handleToggleLocation}
//         className={`px-4 py-2 rounded text-white ${sharingLocation ? 'bg-red-500' : 'bg-green-600'}`}
//       >
//         {sharingLocation ? 'Stop Sharing Location' : 'Start Sharing Location'}
//       </button>
//     </div>
//   );
// };

// export default DriverDashboard;

/*
const [sharing, setSharing] = useState(false);
const [socket, setSocket] = useState(null);

const startSharingLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }

  const newSocket = io('http://localhost:5000');
  setSocket(newSocket);

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      newSocket.emit('locationUpdate', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        driverId: user._id, // assuming this is in context
      });
    },
    (err) => console.error('Geolocation error:', err),
    { enableHighAccuracy: true }
  );

  setSharing(true);

  // Save watchId to stop later
  newSocket.on('disconnect', () => navigator.geolocation.clearWatch(watchId));
};

const stopSharingLocation = () => {
  if (socket) {
    socket.disconnect();
    setSocket(null);
  }
  setSharing(false);
};
*/