import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        {/* Code */}
        <h1 className="text-7xl font-bold text-slate-300">404</h1>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            Page not found
          </h2>
          <p className="text-slate-600">
            The page you are looking for doesn’t exist or may have been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>

          <Link to="/projects">
            <Button variant="secondary">View Projects</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
