const AuthLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
