import { useEffect, useState } from 'react';
import { getFollowing } from '@/services/social.service';
import useAuth from '@/hooks/useAuth';

export default function Following() {
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getFollowing(user._id)
      .then((res) => setFollowing(res.data.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div>Loading following...</div>;

  return (
    <div className="max-w-md mx-auto space-y-3">
      {following.map((person) => (
        <div
          key={person._id}
          className="border p-3 rounded flex justify-between"
        >
          <span>{person.name}</span>
        </div>
      ))}
    </div>
  );
}
