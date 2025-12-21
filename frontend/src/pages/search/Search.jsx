import { useEffect, useState } from 'react';
import { search } from '@/services/search.service';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import { Link } from 'react-router-dom';

const DEBOUNCE_MS = 400;

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await search({ q: query });
        setResults(res.data.data || []);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Input
        placeholder="Search users or projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center text-slate-500">
          No results found
        </div>
      )}

      <div className="space-y-3">
        {results.map((item) => (
          <SearchResult key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
