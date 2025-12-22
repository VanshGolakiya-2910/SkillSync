import { Search, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function SearchBar({
  placeholder = 'Search projects or users...',
  className = '',
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const urlQuery = params.get('q') || '';

  const [value, setValue] = useState(urlQuery);

  // Keep input in sync if URL changes externally
  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  const handleChange = (e) => {
    const next = e.target.value;
    setValue(next);

    if (!next.trim()) {
      navigate('/search', { replace: true });
      return;
    }

    navigate(`/search?q=${encodeURIComponent(next)}`, { replace: true });
  };

  const handleClear = () => {
    setValue('');
    navigate('/search', { replace: true });
  };

  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 rounded-full border border-slate-300
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent text-sm"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
