import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { updateUserProfile, uploadAvatar } from '@/services/user.service';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function EditProfile() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    await uploadAvatar(data);
    await refreshUser();
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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4"
    >
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <input type="file" onChange={handleAvatarChange} />

      <Button type="submit" loading={loading}>
        Save Changes
      </Button>
    </form>
  );
}
