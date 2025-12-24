import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

export default function ProfileActions({
  owner,
  isFollowing,
  onFollow,
  loading,
}) {
  if (owner) {
    return (
      <div className="flex flex-wrap gap-3 pt-2">
        <Link to="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>

        <Link to="/profile/password">
          <Button variant="secondary">Change Password</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <Button
        onClick={onFollow}
        loading={loading}
        variant={isFollowing ? 'secondary' : 'primary'}
        disabled={isFollowing}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
}
