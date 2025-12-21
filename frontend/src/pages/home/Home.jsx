import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/common/Button';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold">
        Welcome{user?.name ? `, ${user.name}` : ''} 👋
      </h1>

      <p className="text-slate-600">
        Manage your projects, connect with others, and showcase your work.
      </p>

      <div className="flex gap-4">
        <Link to="/projects">
          <Button>View Projects</Button>
        </Link>

        <Link to="/projects/new">
          <Button variant="secondary">Create Project</Button>
        </Link>

        <Link to="/profile">
          <Button variant="ghost">My Profile</Button>
        </Link>
      </div>
    </div>
  );
}
