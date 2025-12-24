const UploadButton = ({ text }) => {
  return (
    <span className="inline-block px-4 py-2 rounded-full
                     bg-indigo-600 text-white
                     text-sm font-medium">
      {text}
    </span>
  );
};

export default UploadButton;
