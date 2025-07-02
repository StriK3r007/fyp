// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Search } from 'lucide-react';

// export default function SearchBar({onSelectStop }) {
//   const [stops, setStops] = useState([]);
//   const [filteredStops, setFilteredStops] = useState([]);
//   const [query, setQuery] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [pinnedStops, setPinnedStops] = useState([]);

//   useEffect(() => {
//   const fetchStops = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('/api/stops/public', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setStops(res.data);
//       setFilteredStops(res.data);
//       loadPinnedStops(res.data);
//     } catch (err) {
//       console.error('Failed to fetch stops:', err);
//     }
//   };
//   fetchStops();
// }, []);

//   const loadPinnedStops = (allStops) => {
//     const usage = JSON.parse(localStorage.getItem('stop_usage') || '{}');
//     const sorted = Object.entries(usage)
//       .sort((a, b) => b[1] - a[1]) // sort by usage count
//       .slice(0, 5) // top 5
//       .map(([id]) => allStops.find(s => s._id === id))
//       .filter(Boolean);
//     setPinnedStops(sorted);
//   };

//   const incrementUsage = (stopId) => {
//     const usage = JSON.parse(localStorage.getItem('stop_usage') || '{}');
//     usage[stopId] = (usage[stopId] || 0) + 1;
//     localStorage.setItem('stop_usage', JSON.stringify(usage));
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setQuery(value);
//     setFilteredStops(
//       stops.filter((stop) =>
//         stop.name.toLowerCase().includes(value.toLowerCase())
//       )
//     );
//   };

//   const handleSelectStop = (stop) => {
//     setQuery(stop.name);
//     setShowDropdown(false);
//     incrementUsage(stop._id);  // track in localStorage
//     loadPinnedStops(stops);    // update pinned stops
//     onSelectStop && onSelectStop(stop); // pass stop to parent
//   };


//   return (
//     <div className="relative w-full max-w-md z-50">
//       {/* 🔖 Pinned Stops (Most Searched) */}
//       {pinnedStops.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-1">
//           {pinnedStops.map((stop) => (
//             <button
//               key={stop._id}
//               onClick={() => handleSelectStop(stop)}
//               className="bg-blue-500 hover:bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full transition"
//             >
//               {stop.name}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* 🔍 Search Box */}
//       <div className="flex items-center bg-white shadow rounded-full px-4 py-2">
//         <Search className="text-gray-500 mr-2" />
//         <input
//           type="text"
//           placeholder="Search for a stop..."
//           value={query}
//           onChange={handleInputChange}
//           onFocus={() => setShowDropdown(true)}
//           onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//           className="w-full outline-none text-sm text-gray-600"
//         />
//       </div>

//       {/* 📋 Dropdown Results */}
//       {showDropdown && filteredStops.length > 0 && (
//         <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
//           {filteredStops.map((stop) => (
//             <li
//               key={stop._id}
//               onClick={() => handleSelectStop(stop)}
//               className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-600"
//             >
//               {stop.name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

export default function SearchBar({ onSelectStop }) {
  const [stops, setStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [pinnedStops, setPinnedStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0); // default to first item

  useEffect(() => {
    const fetchStops = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/stops/public');
        setStops(res.data);
        setFilteredStops(res.data);
        loadPinnedStops(res.data);
      } catch (err) {
        console.error('Failed to fetch stops:', err);
        setError('Failed to load stops. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStops();
  }, []);

  const loadPinnedStops = (allStops) => {
  const recent = JSON.parse(localStorage.getItem('recent_stops') || '[]');
  const pins = recent
    .map(id => allStops.find(s => s._id === id))
    .filter(Boolean);

  setPinnedStops(pins);
};

  // const incrementUsage = (stopId) => {
  //   const usage = JSON.parse(localStorage.getItem('stop_usage') || '{}');
  //   usage[stopId] = (usage[stopId] || 0) + 1;
  //   localStorage.setItem('stop_usage', JSON.stringify(usage));
  // };

  const updateRecentStops = (stopId) => {
  let recent = JSON.parse(localStorage.getItem('recent_stops') || '[]');

  // Remove if already exists
  recent = recent.filter(id => id !== stopId);

  // Add to front
  recent.unshift(stopId);

  // Limit to 3
  if (recent.length > 3) {
    recent = recent.slice(0, 3);
  }

  localStorage.setItem('recent_stops', JSON.stringify(recent));
};

  const handleInputChange = (e) => {
  const value = e.target.value;
  setQuery(value);
  setShowDropdown(true); // <-- ensure dropdown always opens on typing
  setFilteredStops(
    stops.filter(stop =>
      stop.name.toLowerCase().includes(value.toLowerCase())
    )
  );
  setHighlightIndex(0); // reset to first option
};

  const handleSelectStop = (stop) => {
  setQuery(stop.name);
  setShowDropdown(false);
  updateRecentStops(stop._id);     // ✅ use recency tracking
  setTimeout(() => loadPinnedStops(stops), 0);
  onSelectStop?.(stop);
  setHighlightIndex(0);
};

  const handleFocus = () => {
    setShowDropdown(true);
    setHighlightIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    // if (!showDropdown) setShowDropdown(true);

    if (e.key === 'ArrowDown') {
      setHighlightIndex((prev) => Math.min(prev + 1, filteredStops.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      handleSelectStop(filteredStops[highlightIndex]);
    }
  };

  return (
    <div className="relative w-full max-w-xl z-50 flex items-center gap-4">
      {/* 🔍 Search Box */}
      <div className="flex-grow relative">
        <div className="flex items-center bg-white shadow rounded-full px-4 py-2">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search for a stop..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onKeyDown={handleKeyDown}
            className="w-full outline-none text-sm text-gray-600"
          />
        </div>

        {/* ⏳ Loading or ❌ Error */}
        {loading && (
          <div className="absolute mt-1 text-xs text-gray-400 px-2">Loading...</div>
        )}
        {error && (
          <div className="absolute mt-1 text-xs text-red-500 px-2">{error}</div>
        )}

        {/* 📋 Dropdown Results */}
        {showDropdown && filteredStops.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
            {filteredStops.map((stop, idx) => (
              <li
                key={stop._id}
                onClick={() => handleSelectStop(stop)}
                className={`px-4 py-2 cursor-pointer text-sm text-gray-600 hover:bg-gray-100 ${
                  idx === highlightIndex ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                {stop.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📌 Pinned Stops */}
      {pinnedStops.length > 0 && (
        <div className="flex gap-2">
          {pinnedStops.map((stop) => (
            <button
              key={stop._id}
              onClick={() => handleSelectStop(stop)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full transition"
            >
              {stop.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}