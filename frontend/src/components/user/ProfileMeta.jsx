export default function ProfileMeta({ user }) {
  if (!user.bio && !user.location) return null;

  return (
    <div className="rounded-xl border bg-white p-6 space-y-3">
      {user.bio && (
        <div>
          <h3 className="text-sm font-medium text-slate-700">
            About
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            {user.bio}
          </p>
        </div>
      )}

      {user.location && (
        <div>
          <h3 className="text-sm font-medium text-slate-700">
            Location
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            {user.location}
          </p>
        </div>
      )}
    </div>
  );
}
