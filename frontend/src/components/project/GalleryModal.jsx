    import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryModal = ({
  images = [],
  index,
  onClose,
  onPrev,
  onNext,
}) => {
  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:opacity-80"
      >
        <X size={28} />
      </button>

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-6 text-white hover:opacity-80"
        >
          <ChevronLeft size={36} />
        </button>
      )}

      {/* Image */}
      <img
        src={images[index]}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-6 text-white hover:opacity-80"
        >
          <ChevronRight size={36} />
        </button>
      )}
    </div>
  );
};

export default GalleryModal;
