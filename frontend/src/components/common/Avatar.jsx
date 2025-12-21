const Avatar = ({ src, alt = 'avatar', size = 40 }) => {
  return (
    <img
      src={src || 'https://via.placeholder.com/150'}
      alt={alt}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
