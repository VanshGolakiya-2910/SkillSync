import { useEffect, useState } from 'react';
import { getAllProjects } from '@/services/project.service';
import ProjectCard from '@/components/project/ProjectCard';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then((res) => setProjects(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
