import { useEffect, useState } from 'react';
import { getFollowers } from '@/services/social.service';
import useAuth from '@/hooks/useAuth';

export default function Followers() {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getFollowers(user._id)
      .then((res) => setFollowers(res.data.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div>Loading followers...</div>;

  return (
    <div className="max-w-md mx-auto space-y-3">
      {followers.map((follower) => (
        <div
          key={follower._id}
          className="border p-3 rounded flex justify-between"
        >
          <span>{follower.name}</span>
        </div>
      ))}
    </div>
  );
}
