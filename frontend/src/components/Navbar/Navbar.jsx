// components/Navbar/Navbar.jsx
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import axios from 'axios';

export default function Navbar({onSelectStop}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current user if logged in
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <div className="w-full shadow-md p-2 bg-white flex justify-between items-center z-1">
      <SearchBar onSelectStop={onSelectStop} />
      {/* <SearchBar onSelectStop={onSelectStop}  onSelectStop={(stop) => console.log("Selected stop:", stop)} /> */}
      <UserMenu user={user} />
    </div>
  );
}
