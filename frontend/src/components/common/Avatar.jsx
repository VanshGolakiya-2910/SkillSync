import defaultAvatar from '@/assets/images/default-avatar.png';

const Avatar = ({ src, size = 40 }) => {
  return (
    <img
      src={src || defaultAvatar}
      onError={(e) => {
        e.currentTarget.src = defaultAvatar;
      }}
      alt="Avatar"
      className="rounded-full object-cover bg-slate-100"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
