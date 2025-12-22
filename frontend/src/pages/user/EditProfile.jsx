import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import {
  updateUserProfile,
  uploadAvatar,
} from '@/services/user.service';

import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    isProfilePublic: user?.isProfilePublic ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    setAvatarLoading(true);
    try {
      await uploadAvatar(data);
      await refreshUser();
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(form);
      await refreshUser();
      navigate('/profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Profile
        </h1>
        <p className="text-slate-600 mt-1">
          Update your public profile and personal information.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-sm font-medium text-slate-700 mb-4">
          Profile picture
        </h2>

        <div className="flex items-center gap-6">
          <Avatar src={user.avatar} size={96} />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <Button
            type="button"
            variant="secondary"
            loading={avatarLoading}
            onClick={() => fileInputRef.current?.click()}
          >
            Change avatar
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-white p-6 space-y-6"
      >
        <h2 className="text-sm font-medium text-slate-700">
          Profile information
        </h2>

        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        {/* Bio (textarea without changing Input component) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">
            Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tell people a little about yourself"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <Input
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="GitHub"
            name="github"
            value={form.github}
            onChange={handleChange}
            placeholder="github.com/username"
          />

          <Input
            label="LinkedIn"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/in/username"
          />
        </div>

        {/* Privacy */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            name="isProfilePublic"
            checked={form.isProfilePublic}
            onChange={handleChange}
            className="mt-1"
          />
          <div>
            <p className="text-sm font-medium text-slate-700">
              Public profile
            </p>
            <p className="text-sm text-slate-500">
              Allow others to view your profile and projects.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={saving}>
            Save changes
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
