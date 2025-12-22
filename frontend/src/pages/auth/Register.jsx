import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@/services/auth.service';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthFooter from '@/components/auth/AuthFooter';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" loading={loading}>
          Sign Up
        </Button>
      </form>

      <AuthFooter type="register" />
    </AuthLayout>
  );
}
