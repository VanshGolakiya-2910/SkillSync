import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  getProjectById,
  updateProject,
  updateProjectVisibility,
  updateProjectTags,
  updateProjectTechStack,
} from '@/services/project.service';

import {
  updateProjectImages,
  updateProjectVideo,
} from '@/services/media.service';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Tag from '@/components/common/Tag';
import UploadBox from '@/components/common/UploadBox';
import UploadButton from '@/components/common/UploadButton';

// Size limits (in bytes)
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: [],
    techStack: [],
    visibility: 'public',
  });

  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');

  /* ---------------- Fetch Project ---------------- */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        const data = res?.data?.data?.project || res?.data?.data;

        setForm({
          title: data.title || '',
          description: data.description || '',
          tags: data.tags || [],
          techStack: data.techStack || [],
          visibility: data.visibility || 'public',
        });

        setExistingPhotos(data.projectPhotos || []);
        setCurrentVideo(data.projectVideo || '');
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load project');
        console.error(error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  /* ---------------- Validate File Size ---------------- */
  const validateImageSize = (file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(`${file.name} is too large (${sizeMB}MB). Max size is 5MB.`);
      return false;
    }
    return true;
  };

  const validateVideoSize = (file) => {
    if (file.size > MAX_VIDEO_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(`Video is too large (${sizeMB}MB). Max size is 100MB.`);
      return false;
    }
    return true;
  };

  /* ---------------- Save Basic Info ---------------- */
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    if (existingPhotos.length === 0) {
      toast.error('Project must have at least one image');
      return;
    }

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
    } catch (error) {
      toast.error('Failed to update project');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Image Upload ---------------- */
  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    // Validate all files first
    const validFiles = [];
    for (let i = 0; i < files.length; i++) {
      if (validateImageSize(files[i])) {
        validFiles.push(files[i]);
      }
    }

    if (validFiles.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();

    // Add existing photos
    existingPhotos.forEach((url) => {
      formData.append('existingPhotos[]', url);
    });

    // Add new photos
    validFiles.forEach((file) => {
      formData.append('photos', file);
    });

    try {
      const response = await updateProjectImages(id, formData);
      const updatedProject = response?.data?.data?.project;
      
      if (updatedProject?.projectPhotos) {
        setExistingPhotos(updatedProject.projectPhotos);
      }

      toast.success(`${validFiles.length} image(s) uploaded successfully`);
      
      // Clear the input
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to upload images';
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setUploadingImages(false);
    }
  };

  /* ---------------- Image Remove ---------------- */
  const handleRemoveImage = async (urlToRemove) => {
    if (existingPhotos.length === 1) {
      toast.error('Project must have at least one image');
      return;
    }

    const updatedPhotos = existingPhotos.filter((url) => url !== urlToRemove);
    
    setUploadingImages(true);
    const formData = new FormData();
    
    // Send updated list
    updatedPhotos.forEach((url) => {
      formData.append('existingPhotos[]', url);
    });

    try {
      const response = await updateProjectImages(id, formData);
      const updatedProject = response?.data?.data?.project;
      
      if (updatedProject?.projectPhotos) {
        setExistingPhotos(updatedProject.projectPhotos);
      }
      
      toast.success('Image removed successfully');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to remove image';
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setUploadingImages(false);
    }
  };

  /* ---------------- Video Upload ---------------- */
  const handleVideoUpload = async (file) => {
    if (!file) return;

    if (!validateVideoSize(file)) return;

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await updateProjectVideo(id, formData);
      const updatedProject = response?.data?.data?.project;
      
      if (updatedProject?.projectVideo) {
        setCurrentVideo(updatedProject.projectVideo);
      }
      
      toast.success('Video uploaded successfully');
      
      // Clear the input
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to upload video';
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setUploadingVideo(false);
    }
  };

  /* ---------------- Loading State ---------------- */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20">
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 rounded animate-pulse" />
          <div className="h-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-slate-600 mt-1">
          Update project details and media
        </p>
      </header>

      {/* BASIC INFO */}
      <section className="space-y-6">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter project title"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Describe your project..."
            className="w-full border border-slate-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* VISIBILITY */}
      <section className="space-y-2">
        <p className="text-sm font-medium">Visibility</p>
        <div className="flex gap-6">
          {['public', 'private'].map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={form.visibility === v}
                onChange={() => setForm({ ...form, visibility: v })}
                className="cursor-pointer"
              />
              <span className="capitalize">{v}</span>
            </label>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="space-y-3">
        <p className="text-sm font-medium">Tech Stack</p>

        <Input
          placeholder="Add technology and press Enter"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const value = techInput.trim();
              if (value && !form.techStack.includes(value)) {
                setForm({
                  ...form,
                  techStack: [...form.techStack, value],
                });
                setTechInput('');
              }
            }
          }}
        />

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
        <p className="text-sm font-medium">Tags</p>

        <Input
          placeholder="Add tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const value = tagInput.trim();
              if (value && !form.tags.includes(value)) {
                setForm({
                  ...form,
                  tags: [...form.tags, value],
                });
                setTagInput('');
              }
            }
          }}
        />

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

      {/* EXISTING IMAGES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Images ({existingPhotos.length})
          </p>
          <p className="text-xs text-slate-500">Max 5MB per image</p>
        </div>

        {existingPhotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingPhotos.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Project ${index + 1}`}
                  className="rounded-md object-cover h-32 w-full"
                />
                <button
                  onClick={() => handleRemoveImage(url)}
                  disabled={uploadingImages}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-md p-8 text-center">
            <p className="text-slate-500">No images yet</p>
          </div>
        )}
      </section>

      {/* MEDIA UPLOAD */}
      <section className="grid sm:grid-cols-2 gap-6">
        {/* Image Upload */}
        <UploadBox
          label="Add More Images"
          description="Upload multiple images (Max 5MB each)"
          onClick={() => !uploadingImages && imageInputRef.current?.click()}
        >
          <UploadButton
            text={uploadingImages ? 'Uploading...' : 'Upload Images'}
            disabled={uploadingImages}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploadingImages}
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </UploadBox>

        {/* Video Upload */}
        <UploadBox
          label="Project Video"
          description={currentVideo ? 'Replace video (Max 100MB)' : 'Upload demo video (Max 100MB)'}
          onClick={() => !uploadingVideo && videoInputRef.current?.click()}
        >
          {currentVideo && (
            <div className="mb-2">
              <video
                src={currentVideo}
                className="w-full h-32 object-cover rounded"
                controls
              />
            </div>
          )}
          <UploadButton
            text={uploadingVideo ? 'Uploading...' : currentVideo ? 'Replace Video' : 'Upload Video'}
            disabled={uploadingVideo}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            hidden
            disabled={uploadingVideo}
            onChange={(e) => handleVideoUpload(e.target.files?.[0])}
          />
        </UploadBox>
      </section>

      {/* ACTIONS */}
      <section className="flex justify-end gap-3 pt-6 border-t">
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${id}`)}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          loading={saving}
          onClick={handleSave}
          disabled={uploadingImages || uploadingVideo}
        >
          Save Changes
        </Button>
      </section>
    </div>
  );
}