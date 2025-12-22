import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '@/services/project.service';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    techStack: '',
  });

  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);

  /* ---------------- handlers ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setPhotos(files);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ---- frontend validation (matches backend) ---- */
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    if (!photos.length) {
      toast.error('At least one project photo is required');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      data.append('title', form.title);
      data.append('description', form.description);
      data.append('tags', form.tags);
      data.append('techStack', form.techStack);

      photos.forEach((photo) => {
        data.append('projectPhotos', photo);
      });

      if (video) {
        data.append('projectVideo', video);
      }

      await createProject(data);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  function UploadBox({ label, description, onClick, children }) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">{label}</p>
        <div
          onClick={onClick}
          className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 transition p-6 text-center bg-slate-50"
        >
          {children}
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>
      </div>
    );
  }

  function UploadButton({ text }) {
    return (
      <span className="inline-block px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium">
        {text}
      </span>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Create New Project</h1>

      {/* Title */}
      <Input
        label="Project Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />

      {/* Description */}
      <Input
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />

      {/* Tags */}
      <Input
        label="Tags (comma separated)"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="react, node, mongodb"
      />

      {/* Tech Stack */}
      <Input
        label="Tech Stack (comma separated)"
        name="techStack"
        value={form.techStack}
        onChange={handleChange}
        placeholder="React, Node.js, MongoDB"
      />

      {/* Project Photos */}
      <div className="space-y-3">
        <UploadBox
          label="Project Photos *"
          description="Upload at least one image (PNG, JPG)"
          onClick={() => document.getElementById('projectPhotos').click()}
        >
          <UploadButton text="Upload Images" />
        </UploadBox>

        <input
          id="projectPhotos"
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotosChange}
          className="hidden"
        />

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(photo)}
                alt="preview"
                className="h-28 w-full object-cover rounded-lg border"
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Video */}
      <div className="space-y-3">
        <UploadBox
          label="Project Video (optional)"
          description="MP4, WebM recommended"
          onClick={() => document.getElementById('projectVideo').click()}
        >
          <UploadButton text="Upload Video" />
        </UploadBox>

        <input
          id="projectVideo"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="hidden"
        />

        {video && (
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-full rounded-lg border"
          />
        )}
      </div>

      {/* Submit */}
      <Button type="submit" loading={loading}>
        Create Project
      </Button>
    </form>
  );
}
