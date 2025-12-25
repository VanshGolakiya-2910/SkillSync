import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, PinOff } from 'lucide-react';
import Button from '@/components/common/Button';
import { updatePinnedProjects } from '@/services/user.service';
import { useState } from 'react';

const SortableItem = ({ project, onUnpin }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border rounded-lg p-3 bg-slate-50"
    >
      <GripVertical
        {...listeners}
        {...attributes}
        className="cursor-grab text-slate-400"
      />

      <div className="flex-1 font-medium">
        {project.title}
      </div>

      <Button variant="secondary" onClick={onUnpin}>
        <PinOff size={16} />
      </Button>
    </div>
  );
};

export default function ManagePinnedProjects({
  open,
  pinnedProjects,
  onClose,
  onSaved,
}) {
  const [items, setItems] = useState(pinnedProjects);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p._id === active.id);
    const newIndex = items.findIndex((p) => p._id === over.id);

    const updated = [...items];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    setItems(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePinnedProjects(items.map((p) => p._id));
      onSaved(items);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex justify-between px-5 py-4 border-b">
          <h2 className="font-semibold">Manage Pinned Projects</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((p) => p._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((project) => (
                  <SortableItem
                    key={project._id}
                    project={project}
                    onUnpin={() =>
                      setItems((prev) =>
                        prev.filter((p) => p._id !== project._id)
                      )
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="border-t px-5 py-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={saving} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
