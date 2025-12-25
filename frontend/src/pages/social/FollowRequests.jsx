import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFollowRequests, acceptFollow } from '@/services/social.service';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';

export default function FollowRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getFollowRequests();
        const data = res?.data?.data;

        if (Array.isArray(data?.requestedUsers)) {
          setRequests(data.requestedUsers);
        } else {
          setRequests([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (userId) => {
    setAcceptingId(userId);
    try {
      await acceptFollow(userId);
      setRequests((prev) => prev.filter((r) => r._id !== userId));
    } finally {
      setAcceptingId(null);
    }
  };

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl border bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- Empty ---------------- */
  if (!requests.length) {
    return (
      <div className="text-center py-24 space-y-3">
        <h2 className="text-lg font-semibold">
          No follow requests yet
        </h2>
        <p className="text-slate-600">
          When someone requests to follow you, it’ll appear here.
        </p>
      </div>
    );
  }

  /* ---------------- List ---------------- */
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Follow Requests</h1>
        <p className="text-slate-600">
          People who want to follow you
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {requests.map((person) => (
          <div
            key={person._id}
            className="flex items-center gap-4 border rounded-xl p-4 bg-white"
          >
            <Link to={`/profile/${person._id}`}>
              <Avatar src={person.avatar} size={48} />
            </Link>

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

            <Button
              loading={acceptingId === person._id}
              onClick={() => handleAccept(person._id)}
            >
              Accept
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
