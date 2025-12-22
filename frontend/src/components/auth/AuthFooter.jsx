import { Link } from 'react-router-dom';

const AuthFooter = ({ type }) => {
  return (
    <div className="text-sm text-center text-slate-600 mt-4">
      {type === 'login' && (
        <>
          Don’t have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </>
      )}

      {type === 'register' && (
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthFooter;
