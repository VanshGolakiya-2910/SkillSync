import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from '@/routes/AppRoutes';
import useAuth from '@/hooks/useAuth';
import { Suspense } from 'react';
function App() {
  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
