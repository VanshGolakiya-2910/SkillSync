const UploadBox = ({ label, description, onClick, children }) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">
        {label}
      </p>

      <div
        onClick={onClick}
        className="cursor-pointer rounded-xl border-2 border-dashed
                   border-slate-300 hover:border-indigo-400
                   transition p-6 text-center bg-slate-50"
      >
        {children}
        {description && (
          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadBox;
