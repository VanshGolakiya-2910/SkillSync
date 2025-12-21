const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {children}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-slate-600 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
