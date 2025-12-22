import { useState } from 'react';
import { forgotPassword } from '@/services/auth.service';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" loading={loading}>
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  );
}
