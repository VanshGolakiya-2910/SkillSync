import Avatar from '@/components/common/Avatar';

export default function ProfileHeader({ user }) {
  return (
    <div className="flex items-center gap-5">
      <Avatar src={user.avatar} size={96} />

      <div className="flex-1">
        <h1 className="text-xl font-semibold text-slate-900">
          {user.name}
        </h1>

        {user.username && (
          <p className="text-slate-500 text-sm mt-1">
            @{user.username}
          </p>
        )}
      </div>
    </div>
  );
}
