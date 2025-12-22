import { useEffect, useState } from 'react';
import { getAllProjects } from '@/services/project.service';
import ProjectCard from '@/components/project/ProjectCard';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjects();

        const data = res?.data?.data;

        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data?.projects)) {
          setProjects(data.projects);
        } else {
          setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ---------------- Loading UI ---------------- */
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-lg border animate-pulse bg-slate-100"
          />
        ))}
      </div>
    );
  }

  /* ---------------- Empty state ---------------- */
  if (!projects.length) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-semibold">No projects yet</h2>
        <p className="text-slate-600">
          Create your first project to showcase your work.
        </p>
      </div>
    );
  }

  /* ---------------- Projects grid ---------------- */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-slate-600">
          Browse and manage all your projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
