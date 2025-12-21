import { useState } from 'react';
import { createProject } from '@/services/project.service';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);

      await createProject(data);
      navigate('/');
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
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <Input
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <Button type="submit" loading={loading}>
        Create Project
      </Button>
    </form>
  );
}
