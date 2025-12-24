import { useState } from 'react';
import GalleryModal from '@/components/project/GalleryModal';

const ProjectGallery = ({ images = [], video }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!images.length && !video) {
    return (
      <div className="rounded-xl border bg-slate-50 p-8 text-center text-slate-500">
        No media uploaded for this project.
      </div>
    );
  }

  const visibleImages = images.slice(0, 4);
  const remaining = images.length - 4;
  return (
    <>
      <div className="space-y-6">
        {images.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Hero Image */}
            {visibleImages[0] && (
              <div
                className="lg:col-span-2 row-span-2 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setActiveIndex(0)}
              >
                <img
                  src={visibleImages[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Thumbnails */}
            {visibleImages.slice(1).map((src, idx) => {
              const imageIndex = idx + 1;
              const isLast = idx === 2 && remaining > 0;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(imageIndex)}
                  className="relative rounded-xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {isLast && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold pointer-events-none">
                      +{remaining}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Video */}
        {video && (
          <div className="rounded-xl overflow-hidden border">
            <video src={video} controls className="w-full" />
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {activeIndex !== null && (
        <GalleryModal
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onPrev={() =>
            setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
          }
          onNext={() =>
            setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
          }
        />
      )}
    </>
  );
};

export default ProjectGallery;
