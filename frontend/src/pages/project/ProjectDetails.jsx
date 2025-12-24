import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, deleteProject } from '@/services/project.service';
import useAuth from '@/hooks/useAuth';
import toast from 'react-hot-toast';

import Button from '@/components/common/Button';
import Tag from '@/components/common/Tag';
import VisibilityBadge from '@/components/project/VisibilityBadge';
import { isProjectOwner } from '@/utils/isOwner.js';
import { Pencil } from 'lucide-react';
import ProjectGallery from '@/components/project/ProjectGallery';


/* ---------------- Page ---------------- */
export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        const data = res?.data?.data;
        setProject(data?.project || data || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const isOwner = isProjectOwner(user, project);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-4">
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
        <div className="h-72 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  /* ---------------- Not Found ---------------- */
  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <p className="text-slate-600 mt-1">This project may be private or deleted.</p>
      </div>
    );
  }

  /* ---------------- Delete ---------------- */
  const handleDelete = async () => {
    if (!window.confirm('Delete this project permanently?')) return;

    setDeleting(true);
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      navigate('/projects');
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>

          <VisibilityBadge visibility={project.visibility} />

          {isOwner && (
            <button
              onClick={() => navigate(`/projects/${id}/edit`)}
              className="p-2 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
              title="Edit project"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>

        <div className="h-px bg-slate-200 max-w-2xl" />
      </header>

      {/* Media */}
      <ProjectGallery images={project.projectPhotos} video={project.projectVideo} />

      {/* Description (Framed) */}
      {project.description && (
        <section className="max-w-4xl">
          <div className="rounded-xl bg-slate-50 border px-6 py-5">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </section>
      )}

      {/* Meta */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Tag key={tech} variant="primary">
                  {tech}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag} variant="default">
                  #{tag}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Danger Zone */}
      {isOwner && (
        <section className="pt-14 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">Delete project</h3>
              <p className="text-sm text-slate-500">This action cannot be undone.</p>
            </div>

            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
