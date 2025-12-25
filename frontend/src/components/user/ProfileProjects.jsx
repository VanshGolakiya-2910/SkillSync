import { useEffect, useState } from 'react';
import { getUserFeaturedProjects } from '@/services/user.service';
import ProjectCard from '@/components/project/ProjectCard';
import Button from '@/components/common/Button';
import PinnedProjectsModal from './PinnedProjectsModal';

export default function ProfileProjects({ userId, owner }) {
  const [projects, setProjects] = useState([]);
  const [pinnedIds, setPinnedIds] = useState([]);
  const [mode, setMode] = useState('latest');

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await getUserFeaturedProjects(userId);
      const data = res?.data?.data;

      const list = data?.projects || [];
      const apiMode = data?.mode || 'latest';

      setProjects(list);
      setMode(apiMode);

      // ✅ ONLY mark pinned when backend says so
      if (apiMode === 'pinned') {
        setPinnedIds(list.map((p) => p._id));
      } else {
        setPinnedIds([]);
      }

      setLoading(false);
    };

    if (userId) load();
  }, [userId]);

  if (loading) return null;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>

        {owner && (
          <Button
            variant="secondary"
            onClick={() => setOpenModal(true)}
          >
            Manage Pins
          </Button>
        )}
      </div>

      {/* Projects grid */}
      {projects.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isPinned={pinnedIds.includes(project._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No public projects to show.
        </p>
      )}

      {/* Pin manager modal */}
      {owner && openModal && (
        <PinnedProjectsModal
          pinnedIds={pinnedIds}
          onClose={() => setOpenModal(false)}
          onUpdated={(newPinnedIds) => {
            // ✅ newPinnedIds is authoritative
            setPinnedIds(newPinnedIds);

            // Re-fetch to stay in sync with backend logic
            setOpenModal(false);
          }}
        />
      )}
    </section>
  );
}
