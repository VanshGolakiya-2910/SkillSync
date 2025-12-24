import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  getProjectById,
  updateProject,
  updateProjectVisibility,
  updateProjectTags,
  updateProjectTechStack,
  uploadProjectMedia,
} from '@/services/project.service';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Tag from '@/components/common/Tag';
import UploadBox from '@/components/common/UploadBox';
import UploadButton from '@/components/common/UploadButton';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: [],
    techStack: [],
    visibility: 'public',
  });

  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');

  /* ---------------- Fetch ---------------- */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        const data = res?.data?.data?.project || res?.data?.data;

        setForm({
          title: data.title,
          description: data.description,
          tags: data.tags || [],
          techStack: data.techStack || [],
          visibility: data.visibility || 'public',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  /* ---------------- Save ---------------- */
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProject(id, {
        title: form.title,
        description: form.description,
      });

      await updateProjectTags(id, form.tags);
      await updateProjectTechStack(id, form.techStack);
      await updateProjectVisibility(id, form.visibility);

      toast.success('Project updated successfully');
      navigate(`/projects/${id}`);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Media Upload ---------------- */
  const handleImageUpload = async (files) => {
    if (!files.length) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('projectPhotos', file));

    await uploadProjectMedia(id, formData);
    toast.success('Images uploaded');
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('projectVideo', file);

    await uploadProjectMedia(id, formData);
    toast.success('Video uploaded');
  };

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20">
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-slate-600">Update project details, visibility, and media.</p>
      </header>

      {/* BASIC INFO */}
      <section className="space-y-6">
        <Input
          label="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            className="w-full rounded-md border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-primary"
          />
        </div>
      </section>

      {/* VISIBILITY */}
      <section className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Visibility</p>

        <div className="flex gap-6 text-sm">
          {['public', 'private'].map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input
                type="radio"
                checked={form.visibility === v}
                onChange={() => setForm({ ...form, visibility: v })}
              />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Tech Stack</p>

        <div className="flex gap-2">
          <Input
            placeholder="Add tech"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();

                if (!techInput.trim()) return;
                if (form.techStack.includes(techInput)) return;

                setForm({
                  ...form,
                  techStack: [...form.techStack, techInput],
                });
                setTechInput('');
              }
            }}
          />
          <Button
            onClick={() => {
              if (!techInput.trim()) return;
              if (form.techStack.includes(techInput)) return;

              setForm({
                ...form,
                techStack: [...form.techStack, techInput],
              });
              setTechInput('');
            }}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.techStack.map((tech) => (
            <Tag
              key={tech}
              variant="primary"
              removable
              onRemove={() =>
                setForm({
                  ...form,
                  techStack: form.techStack.filter((t) => t !== tech),
                })
              }
            >
              {tech}
            </Tag>
          ))}
        </div>
      </section>

      {/* TAGS */}
      <section className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Tags</p>

        <div className="flex gap-2">
          <Input
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();

                if (!tagInput.trim()) return;
                if (form.tags.includes(tagInput)) return;

                setForm({
                  ...form,
                  tags: [...form.tags, tagInput],
                });
                setTagInput('');
              }
            }}
          />
          <Button
            onClick={() => {
              if (!tagInput.trim()) return;
              if (form.tags.includes(tagInput)) return;

              setForm({
                ...form,
                tags: [...form.tags, tagInput],
              });
              setTagInput('');
            }}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <Tag
              key={tag}
              removable
              onRemove={() =>
                setForm({
                  ...form,
                  tags: form.tags.filter((t) => t !== tag),
                })
              }
            >
              #{tag}
            </Tag>
          ))}
        </div>
      </section>

      {/* MEDIA */}
      <section className="grid sm:grid-cols-2 gap-6">
        <UploadBox
          label="Project Images"
          description="Upload new images (replaces existing ones)"
          onClick={() => imageInputRef.current.click()}
        >
          <UploadButton text="Upload Images" />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </UploadBox>

        <UploadBox
          label="Project Video"
          description="Optional demo video"
          onClick={() => videoInputRef.current.click()}
        >
          <UploadButton text="Upload Video" />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => handleVideoUpload(e.target.files[0])}
          />
        </UploadBox>
      </section>

      {/* ACTIONS */}
      <section className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="secondary" onClick={() => navigate(`/projects/${id}`)}>
          Cancel
        </Button>

        <Button loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </section>
    </div>
  );
}
