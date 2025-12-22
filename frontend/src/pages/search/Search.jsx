import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAll } from '@/services/search.service';
import SearchResult from '@/components/search/SearchResult';
import useDebounce from '@/hooks/useDebounce';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const debouncedQuery = useDebounce(query, 400);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let isActive = true;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchAll(debouncedQuery);
        const data = res?.data?.data;

        if (!isActive) return;

        if (Array.isArray(data)) setResults(data);
        else setResults([]);
      } finally {
        isActive && setLoading(false);
      }
    };

    fetchResults();

    return () => {
      isActive = false;
    };
  }, [debouncedQuery]);


  /* ---------------- Empty initial ---------------- */
  if (!query.trim()) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-slate-500">
        Start typing to search users or projects
      </div>
    );
  }

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl border bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- No results ---------------- */
  if (!results.length) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-2">
        <h2 className="text-lg font-semibold">No results found</h2>
        <p className="text-slate-600">
          Try a different keyword or check spelling.
        </p>
      </div>
    );
  }

  /* ---------------- Results ---------------- */
  return (
    <div className="max-w-3xl mx-auto py-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Search results for “{query}”
      </h1>

      <div className="space-y-3">
        {results.map((item) => (
          <SearchResult key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
