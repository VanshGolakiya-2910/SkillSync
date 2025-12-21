import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import useAuth from '@/hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
    const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-80 flex flex-col gap-4"
      >
        <Input
          label="Email"
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
          Login
        </Button>
      </form>
    </div>
  );
}
