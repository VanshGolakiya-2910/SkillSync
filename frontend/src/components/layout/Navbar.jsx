import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/common/Avatar';
import SearchBar from '@/components/common/SearchBar';

const navLinkClass = ({ isActive }) =>
  isActive ? 'text-primary font-medium' : 'text-slate-600 hover:text-slate-900';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Future-proof: global search route
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="w-full h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 gap-6">
      {/* Brand */}
      <Link to="/" className="font-semibold text-lg">
        SkillSync
      </Link>

      {/* Search (desktop) */}
      <div className="hidden md:flex flex-1 justify-center">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSubmit={handleSearchSubmit}
          placeholder="Search projects, tech, tags..."
        />
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        <NavLink to="/projects" className={navLinkClass}>
          Projects
        </NavLink>

        <NavLink to="/discover" className={navLinkClass}>
          Discover
        </NavLink>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <Avatar src={user.avatar} size={32} />
              <span className="text-sm text-slate-700">{user.name}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-sm overflow-hidden">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <button className="md:hidden text-slate-700" onClick={() => setOpen((v) => !v)}>
        <Menu size={22} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-14 left-0 w-full bg-white border-b md:hidden">
          <div className="flex flex-col p-4 gap-4">
            <SearchBar
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSubmit={handleSearchSubmit}
            />

            <NavLink
              to="/projects"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Projects
            </NavLink>

            <NavLink
              to="/discover"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Discover
            </NavLink>

            <NavLink
              to="/profile"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Profile
            </NavLink>
            <button onClick={logout} className="text-left text-red-600">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
