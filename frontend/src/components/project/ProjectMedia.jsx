import { useState } from 'react';
import Button from '@/components/common/Button';
import { updateProjectImages, updateProjectVideo } from '@/services/media.service';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const ProjectMedia = ({ projectId }) => {
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const valid = files.filter(
      (file) =>
        file.type.startsWith('image/') && file.size <= MAX_IMAGE_SIZE
    );

    setImages(valid);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith('video/') &&
      file.size <= MAX_VIDEO_SIZE
    ) {
      setVideo(file);
    }
  };

  const uploadImages = async () => {
    if (!images.length) return;
    setLoading(true);
    try {
      await updateProjectImages(projectId, images);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async () => {
    if (!video) return;
    setLoading(true);
    try {
      await updateProjectVideo(projectId, video);
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Image upload */}
      <div className="space-y-2">
        <h3 className="font-medium">Project Images</h3>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        )}

        <Button onClick={uploadImages} loading={loading}>
          Upload Images
        </Button>
      </div>

      {/* Video upload */}
      <div className="space-y-2">
        <h3 className="font-medium">Project Video</h3>
        <input type="file" accept="video/*" onChange={handleVideoChange} />

        {video && (
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-full max-w-md rounded"
          />
        )}

        <Button onClick={uploadVideo} loading={loading}>
          Upload Video
        </Button>
      </div>
    </div>
  );
};

export default ProjectMedia;
