import { Link, NavLink } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full h-14 border-b border-slate-200 flex items-center justify-between px-6">
      <Link to="/" className="font-semibold text-lg">
        SkillSync
      </Link>

      <div className="flex items-center gap-6">
        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? 'text-primary font-medium' : 'text-slate-600'
          }
        >
          Search
        </NavLink>

        {user && (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'text-primary font-medium' : 'text-slate-600'
              }
            >
              Profile
            </NavLink>

            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
