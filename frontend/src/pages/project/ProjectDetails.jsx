import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProjectById,
  deleteProject,
  updateProjectVisibility,
} from '@/services/project.service';
import Button from '@/components/common/Button';
import ProjectMedia from '@/components/project/ProjectMedia';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);

        // ✅ Normalize backend response
        const data = res?.data?.data;
        if (data?._id) {
          setProject(data);
        } else if (data?.project?._id) {
          setProject(data.project);
        } else {
          setProject(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const isOwner =
    user && project && project.owner?.toString() === user._id;

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-2/3 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 bg-slate-200 rounded animate-pulse" />
        <div className="h-64 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  /* ---------------- Not found ---------------- */
  if (!project) {
    return (
      <div className="text-center py-20 space-y-2">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <p className="text-slate-600">
          This project may have been deleted or does not exist.
        </p>
      </div>
    );
  }

  /* ---------------- Delete ---------------- */
  const handleDelete = async () => {
    const confirm = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    );
    if (!confirm) return;

    setDeleting(true);
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      navigate('/projects', { replace: true });
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------- Visibility ---------------- */
  const handleVisibilityChange = async (visibility) => {
    if (visibility === project.visibility) return;

    setUpdatingVisibility(true);
    try {
      await updateProjectVisibility(project._id, visibility);
      setProject((prev) => ({ ...prev, visibility }));
      toast.success(`Project is now ${visibility}`);
    } finally {
      setUpdatingVisibility(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* HERO */}
      <section className="bg-gradient-to-r from-indigo-50 to-slate-50 rounded-2xl p-8 border">
        <h1 className="text-4xl font-bold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 text-lg">
          {project.description}
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT – MEDIA */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Project Media">
            <ProjectMedia projectId={project._id} />
          </Card>
        </div>

        {/* RIGHT – META */}
        <div className="space-y-6">
          {/* Visibility (Owner Only) */}
          {isOwner && (
            <Card title="Visibility">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={project.visibility === 'public'}
                    disabled={updatingVisibility}
                    onChange={() =>
                      handleVisibilityChange('public')
                    }
                  />
                  Public
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={project.visibility === 'private'}
                    disabled={updatingVisibility}
                    onChange={() =>
                      handleVisibilityChange('private')
                    }
                  />
                  Private
                </label>

                <p className="text-xs text-slate-500">
                  Public projects appear in global discovery and
                  search.
                </p>
              </div>
            </Card>
          )}

          {/* Tech Stack */}
          {project.techStack?.length > 0 && (
            <Card title="Tech Stack">
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Tags */}
          {project.tags?.length > 0 && (
            <Card title="Tags">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-slate-200 text-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* DANGER ZONE */}
      {isOwner && (
        <section className="border-t pt-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-700">
                Danger Zone
              </h3>
              <p className="text-sm text-red-600">
                Deleting a project is permanent and cannot be undone.
              </p>
            </div>

            <Button
              variant="danger"
              loading={deleting}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">
      {title && (
        <h2 className="text-lg font-semibold">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
