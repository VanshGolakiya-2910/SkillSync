import { Link } from 'react-router-dom';
import { User, Folder } from 'lucide-react';
import Avatar from '@/components/common/Avatar';

export default function SearchResult({ item }) {
  const isUser = Boolean(item.email);

  if (isUser) {
    return (
      <Link
        to={`/profile/${item._id}`}
        className="block rounded-xl border p-4 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-4">
          <Avatar src={item.avatar} size={40} />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User size={16} className="text-slate-400" />
              <span className="font-medium">{item.name}</span>
            </div>
            <p className="text-sm text-slate-600">{item.email}</p>
          </div>
        </div>
      </Link>
    );
  }

  /* ---------------- Project result ---------------- */

  return (
    <Link
      to={`/projects/${item._id}`}
      className="block rounded-xl border p-4 hover:bg-slate-50 transition"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Folder size={16} className="text-slate-400" />
          <h3 className="font-medium">{item.title}</h3>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2">
          {item.description}
        </p>

        {/* Meta (future-proof) */}
        {(item.techStack?.length || item.tags?.length) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {item.techStack?.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700"
              >
                {tech}
              </span>
            ))}

            {item.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
