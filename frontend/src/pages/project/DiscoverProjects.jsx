import { useEffect, useState } from 'react';
import { getPublicProjects } from '@/services/project.service';
import ProjectCard from '@/components/project/ProjectCard';

export default function DiscoverProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getPublicProjects();
        const data = res?.data?.data;

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-slate-200 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- Empty ---------------- */
  if (!projects.length) {
    return (
      <div className="text-center py-20 space-y-2">
        <h2 className="text-xl font-semibold">
          No public projects yet
        </h2>
        <p className="text-slate-600">
          Be the first to share a project publicly.
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Discover Projects
        </h1>
        <p className="text-slate-600 mt-1">
          Explore projects shared by the community.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            hideActions
          />
        ))}
      </div>
    </div>
  );
}
