import React from 'react';
import { useState } from 'react';
import MapComponent from '../components/MapComponent';
import Navbar from '../components/Navbar/Navbar';

export default function HomePage() {
  const [selectedStop, setSelectedStop] = useState(null);
  return (
    <div className="w-screen h-screen flex flex-col z-10">
      <Navbar onSelectStop={setSelectedStop} />

      {/* Optional: Stop Search component */}
      {/* <StopSearch /> */}

      <div className="flex-1 relative">
        <MapComponent selectedStop={selectedStop} />
      </div>
    </div>
  );
}
