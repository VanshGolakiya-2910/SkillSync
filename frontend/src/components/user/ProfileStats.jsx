export default function ProfileStats({ followers, following }) {
  return (
    <div className="flex gap-6 text-sm text-slate-700">
      <span>
        <strong>{followers}</strong> Followers
      </span>
      <span>
        <strong>{following}</strong> Following
      </span>
    </div>
  );
}
