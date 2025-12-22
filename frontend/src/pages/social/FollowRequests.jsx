import { useEffect, useState } from 'react';
import { getFollowRequests, acceptFollow } from '@/services/social.service';
import Button from '@/components/common/Button';

export default function FollowRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFollowRequests()
      .then((res) => setRequests(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (userId) => {
    await acceptFollow(userId);
    setRequests((prev) => prev.filter((r) => r._id !== userId));
  };

  if (loading) return <div>Loading requests...</div>;

  if (!requests.length) {
    return (
      <div className="text-center py-20 space-y-2">
        <h2 className="text-lg font-semibold">No Follow Requests yet</h2>
        <p className="text-slate-600">
          When someone sends you a follow request, it’ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {requests.map((req) => (
        <div
          key={req._id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <span>{req.name}</span>
          <Button onClick={() => handleAccept(req._id)}>
            Accept
          </Button>
        </div>
      ))}
    </div>
  );
}
