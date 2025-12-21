const Loader = ({ size = 24 }) => {
  return (
    <div
      className="animate-spin rounded-full border-2 border-slate-300 border-t-primary"
      style={{ width: size, height: size }}
    />
  );
};

export default Loader;
