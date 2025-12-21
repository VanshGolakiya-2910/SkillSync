import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="hidden md:block w-64 border-r border-slate-200 p-4">
      <nav className="flex flex-col gap-3">
        <NavLink to="/" className="text-slate-700 hover:text-primary">
          Projects
        </NavLink>
        <NavLink to="/projects/new" className="text-slate-700 hover:text-primary">
          Create Project
        </NavLink>
        <NavLink to="/followers" className="text-slate-700 hover:text-primary">
          Followers
        </NavLink>
        <NavLink to="/following" className="text-slate-700 hover:text-primary">
          Following
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
