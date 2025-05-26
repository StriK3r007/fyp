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
