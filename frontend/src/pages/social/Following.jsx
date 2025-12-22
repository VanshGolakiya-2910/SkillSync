import { useEffect, useState } from 'react';
import { getFollowing } from '@/services/social.service';
import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/common/Avatar';

export default function Following() {
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFollowing = async () => {
      try {
        const res = await getFollowing(user._id);

        // ✅ Normalize backend response safely
        const data = res?.data?.data;

        if (Array.isArray(data)) {
          setFollowing(data);
        } else if (Array.isArray(data?.following)) {
          setFollowing(data.following);
        } else {
          setFollowing([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
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
  if (!following.length) {
    return (
      <div className="text-center py-20 space-y-2">
        <h2 className="text-lg font-semibold">Not following anyone yet</h2>
        <p className="text-slate-600">
          When you follow users, they’ll appear here.
        </p>
      </div>
    );
  }

  /* ---------------- Following list ---------------- */
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Following</h1>
        <p className="text-slate-600">
          People you are following
        </p>
      </div>

      <div className="space-y-3">
        {following.map((person) => (
          <div
            key={person._id}
            className="flex items-center gap-4 border p-3 rounded hover:bg-slate-50 transition"
          >
            <Avatar src={person.avatar} size={40} />

            <div className="flex-1">
              <p className="font-medium">{person.name}</p>
              <p className="text-sm text-slate-500">
                {person.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
