import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Avatar src={user.avatar} size={80} />
        <div>
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <p className="text-slate-600">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
        <Link to="/profile/password">
          <Button variant="secondary">Change Password</Button>
        </Link>
      </div>
    </div>
  );
}
