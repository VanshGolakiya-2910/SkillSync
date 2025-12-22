import { useEffect, useState } from 'react';
import { getFollowers } from '@/services/social.service';
import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/common/Avatar';

export default function Followers() {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFollowers = async () => {
      try {
        const res = await getFollowers(user._id);

        // ✅ Normalize backend response safely
        const data = res?.data?.data;

        if (Array.isArray(data)) {
          setFollowers(data);
        } else if (Array.isArray(data?.followers)) {
          setFollowers(data.followers);
        } else {
          setFollowers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [user]);

  /* ---------------- Loading skeleton ---------------- */
  if (loading) {
    return (
      <div className="max-w-md mx-auto space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 rounded border animate-pulse bg-slate-100"
          />
        ))}
      </div>
    );
  }

  /* ---------------- Empty state ---------------- */
  if (!followers.length) {
    return (
      <div className="text-center py-20 space-y-2">
        <h2 className="text-lg font-semibold">No followers yet</h2>
        <p className="text-slate-600">
          When people follow you, they’ll appear here.
        </p>
      </div>
    );
  }

  /* ---------------- Followers list ---------------- */
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Followers</h1>
        <p className="text-slate-600">
          People who follow you
        </p>
      </div>

      <div className="space-y-3">
        {followers.map((follower) => (
          <div
            key={follower._id}
            className="flex items-center gap-4 border p-3 rounded hover:bg-slate-50 transition"
          >
            <Avatar src={follower.avatar} size={40} />
            <div className="flex-1">
              <p className="font-medium">{follower.name}</p>
              <p className="text-sm text-slate-500">
                {follower.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
