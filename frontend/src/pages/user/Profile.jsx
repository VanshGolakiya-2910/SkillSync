import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div className="flex items-center gap-5">
          <Avatar src={user.avatar} size={96} />

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-slate-900">
              {user.name}
            </h1>

            <p className="text-slate-600 text-sm mt-1">
              {user.email}
            </p>

            {user.username && (
              <p className="text-slate-500 text-sm mt-1">
                @{user.username}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/profile/edit">
            <Button>Edit Profile</Button>
          </Link>

          <Link to="/profile/password">
            <Button variant="secondary">
              Change Password
            </Button>
          </Link>
        </div>
      </div>

      {/* Meta / Info (future-safe, optional fields only) */}
      {(user.bio || user.location) && (
        <div className="rounded-xl border bg-white p-6 space-y-3">
          {user.bio && (
            <div>
              <h3 className="text-sm font-medium text-slate-700">
                About
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {user.bio}
              </p>
            </div>
          )}

          {user.location && (
            <div>
              <h3 className="text-sm font-medium text-slate-700">
                Location
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {user.location}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
