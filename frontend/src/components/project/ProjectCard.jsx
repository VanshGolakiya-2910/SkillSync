import { Link } from 'react-router-dom';
import clsx from 'clsx';

const ProjectCard = ({ project, hideActions = false }) => {
  const isPublic = project.visibility === 'public';

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group border rounded-xl p-4 bg-white hover:shadow-md transition space-y-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-lg leading-tight group-hover:text-primary transition">
          {project.title}
        </h2>

        {/* Visibility Badge */}
        <span
          className={clsx(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            isPublic
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-200 text-slate-600'
          )}
        >
          {isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 line-clamp-2">
        {project.description}
      </p>

      {/* Tags */}
      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer (future safe) */}
      {!hideActions && (
        <div className="pt-2 text-xs text-slate-400">
          View details →
        </div>
      )}
    </Link>
  );
};

export default ProjectCard;
