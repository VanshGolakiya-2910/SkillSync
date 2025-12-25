import { useEffect, useState } from 'react';
import { getAllProjects } from '@/services/project.service';
import { updatePinnedProjects } from '@/services/user.service';

import ProjectCard from '@/components/project/ProjectCard';
import Button from '@/components/common/Button';

const MAX_PINS = 4;

export default function PinnedProjectsModal({
  pinnedIds = [],
  onClose,
  onUpdated,
}) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(() => pinnedIds); // ✅ init ONCE
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- Load all user projects ---------------- */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getAllProjects();
        const list = res?.data?.data?.projects || [];
        setProjects(list);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  /* ---------------- Toggle pin / unpin ---------------- */
  const togglePin = (projectId) => {
    setSelected((prev) => {
      // UNPIN
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      }

      // PIN (limit check)
      if (prev.length >= MAX_PINS) {
        return prev;
      }

      return [...prev, projectId];
    });
  };

  /* ---------------- Save ---------------- */
  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    try {
      await updatePinnedProjects(selected);
      onUpdated(selected); // ✅ update parent source of truth
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 space-y-5 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Manage Pinned Projects ({selected.length}/{MAX_PINS})
          </h3>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!loading &&
            projects.map((project) => {
              const isPinned = selected.includes(project._id);

              return (
                <div
                  key={project._id}
                  onClick={() => togglePin(project._id)}
                  className={`cursor-pointer border rounded-lg transition ${
                    isPinned
                      ? 'ring-2 ring-primary'
                      : 'hover:ring-1 hover:ring-slate-300'
                  }`}
                >
                  <ProjectCard
                    project={project}
                    isPinned={isPinned}
                  />
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            loading={saving}
            disabled={saving}
          >
            Save Pins
          </Button>
        </div>
      </div>
    </div>
  );
}
