const ProjectGallery = ({ images = [], video }) => {
  if (!images.length && !video) {
    return (
      <div className="rounded-xl border bg-slate-50 p-8 text-center text-slate-500">
        No media uploaded for this project.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Project image ${idx + 1}`}
              className="rounded-xl object-cover w-full"
            />
          ))}
        </div>
      )}

      {/* Video */}
      {video && (
        <div className="rounded-xl overflow-hidden border">
          <video
            src={video}
            controls
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;
