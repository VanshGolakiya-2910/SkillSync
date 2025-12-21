import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById, deleteProject } from '@/services/project.service';
import Button from '@/components/common/Button';
import ProjectMedia from '@/components/project/ProjectMedia';
export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectById(id)
      .then((res) => setProject(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading project...</div>;
  if (!project) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">{project.title}</h1>
      <p>{project.description}</p>
      <ProjectMedia projectId={project._id} />

      <div className="flex flex-wrap gap-2">
        {project.techStack?.map((tech) => (
          <span key={tech} className="text-sm bg-slate-200 px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>

      <Button variant="danger" onClick={() => deleteProject(id)}>
        Delete Project
      </Button>
    </div>
  );
}
