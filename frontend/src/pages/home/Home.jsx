import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/common/Button';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">
      {/* Hero */}
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">
          Welcome{user?.name ? `, ${user.name}` : ''} 👋
        </h1>
        <p className="text-slate-600 max-w-2xl">
          This is your workspace. Manage projects, collaborate with others,
          and showcase your skills in one place.
        </p>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="Your Projects"
          description="View, manage, and update all your projects."
          to="/projects"
          buttonText="View Projects"
        />

        <ActionCard
          title="Create Project"
          description="Start something new and add it to your portfolio."
          to="/projects/new"
          buttonText="Create Project"
          variant="secondary"
        />

        <ActionCard
          title="Your Profile"
          description="Update your profile and manage your account."
          to="/profile"
          buttonText="My Profile"
          variant="ghost"
        />
      </section>

      {/* Getting started (future-friendly) */}
      <section className="border-t pt-6 space-y-2">
        <h2 className="text-lg font-medium">Getting started</h2>
        <ul className="text-slate-600 list-disc list-inside space-y-1">
          <li>Create your first project</li>
          <li>Add images or a demo video</li>
          <li>Connect with other users</li>
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Local UI component – scoped to Home only (allowed & recommended)   */
/* ------------------------------------------------------------------ */

function ActionCard({ title, description, to, buttonText, variant }) {
  return (
    <div className="border rounded-lg p-6 flex flex-col justify-between hover:shadow-sm transition">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      <div className="mt-4">
        <Link to={to}>
          <Button variant={variant}>{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
}
