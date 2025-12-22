import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { updateUserProfile, uploadAvatar } from '@/services/user.service';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';

export default function EditProfile() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
  });

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    setLoading(true);
    try {
      await updateUserProfile(form);
      await refreshUser();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Avatar Section */}
      <div className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="text-sm font-medium text-slate-700">
          Profile Picture
        </h2>

        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} size={72} />

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              loading={avatarLoading}
            >
              Change Avatar
            </Button>
          </label>
        </div>
      </div>

      {/* Profile Details */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-white p-6 space-y-5"
      >
        <h2 className="text-sm font-medium text-slate-700">
          Profile Details
        </h2>

        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <div className="pt-2">
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
