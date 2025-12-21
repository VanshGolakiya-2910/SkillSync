import { useState } from 'react';
import { changePassword } from '@/services/user.service';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(form);
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
        label="Current Password"
        type="password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
      />

      <Input
        label="New Password"
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
      />

      <Button type="submit" loading={loading}>
        Update Password
      </Button>
    </form>
  );
}
