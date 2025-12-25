import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFollowers } from '@/services/social.service';
import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/common/Avatar';

export default function Followers() {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ HARD GUARD — prevents /undefined/followers calls
    if (!user?._id) return;

    const fetchFollowers = async () => {
      try {
        const res = await getFollowers(user._id);
        const data = res?.data?.data;

        if (Array.isArray(data?.followers)) {
          setFollowers(data.followers);
        } else {
          setFollowers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [user?._id]); // ✅ correct dependency

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl border bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- Empty ---------------- */
  if (!followers.length) {
    return (
      <div className="text-center py-24 space-y-3">
        <h2 className="text-lg font-semibold">
          No followers yet
        </h2>
        <p className="text-slate-600">
          When people follow you, they’ll appear here.
        </p>
      </div>
    );
  }

  /* ---------------- List ---------------- */
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Followers</h1>
        <p className="text-slate-600">
          People who follow you
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {followers.map((person) => (
          <Link
            key={person._id}
            to={`/profile/${person._id}`}
            className="flex items-center gap-4 border rounded-xl p-4 bg-white hover:bg-slate-50 transition"
          >
            <Avatar src={person.avatar} size={48} />

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {person.name}
              </p>

              {person.username ? (
                <p className="text-sm text-slate-500 truncate">
                  @{person.username}
                </p>
              ) : (
                <p className="text-sm text-slate-400 truncate">
                  {person.email}
                </p>
              )}
            </div>

            <span className="text-xs text-slate-400">
              View →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
