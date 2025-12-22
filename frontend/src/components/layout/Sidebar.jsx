import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const linkBase = 'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition';

const linkClass = ({ isActive }) =>
  isActive
    ? `${linkBase} bg-slate-100 text-primary font-medium`
    : `${linkBase} text-slate-700 hover:bg-slate-50`;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200 bg-white transition-all ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b">
        {!collapsed && (
          <span className="text-sm font-semibold text-slate-700">Navigation</span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-slate-500 hover:text-slate-700 text-sm"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-6">
        {/* Projects */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-slate-500 uppercase">
              Projects
            </p>
          )}
          <div className="space-y-1">
            <NavLink to="/projects" className={linkClass}>
              📁 {!collapsed && 'All Projects'}
            </NavLink>

            <NavLink to="/projects/new" className={linkClass}>
              ➕ {!collapsed && 'Create Project'}
            </NavLink>
          </div>
        </div>

        {/* Social */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-slate-500 uppercase">
              Social
            </p>
          )}
          <div className="space-y-1">
            <NavLink to="/followers" className={linkClass}>
              👥 {!collapsed && 'Followers'}
            </NavLink>

            <NavLink to="/following" className={linkClass}>
              🔗 {!collapsed && 'Following'}
            </NavLink>

            <NavLink to="/follow-requests" className={linkClass}>
              📩 {!collapsed && 'Follow Requests'}
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
