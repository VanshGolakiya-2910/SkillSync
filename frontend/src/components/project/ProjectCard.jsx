import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

const COLLAPSED_DESC_LINES = 1;
const EXPANDED_DESC_LINES = 5;

const COLLAPSED_TAGS = 2;
const COLLAPSED_STACK = 2;

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const isPublic = project.visibility === 'public';
  const [expanded, setExpanded] = useState(false);

  const visibleTags = expanded
    ? project.tags || []
    : project.tags?.slice(0, COLLAPSED_TAGS) || [];

  const visibleStack = expanded
    ? project.techStack || []
    : project.techStack?.slice(0, COLLAPSED_STACK) || [];

  return (
    <div
      onDoubleClick={() => navigate(`/projects/${project._id}`)}
      className={clsx(
        'border rounded-xl transition cursor-default select-none',
        expanded ? 'bg-slate-50' : 'bg-white',
        'hover:shadow-sm'
      )}
    >
      <div className="p-4 space-y-3 cursor-pointer" >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          {/* Title + Visibility */}
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-semibold text-lg leading-tight truncate">
              {project.title}
            </h2>

            <span
              className={clsx(
                'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                isPublic
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-200 text-slate-600'
              )}
            >
              {isPublic ? 'Public' : 'Private'}
            </span>
          </div>

          {/* Expand Arrow */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-600"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* DESCRIPTION */}
        <div>
          {expanded && (
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
              Description
            </p>
          )}

          <p
            className={clsx(
              'text-sm text-slate-700 leading-relaxed',
              expanded
                ? `line-clamp-${EXPANDED_DESC_LINES}`
                : `line-clamp-${COLLAPSED_DESC_LINES}`
            )}
          >
            {project.description}
          </p>
        </div>

        {/* TECH STACK */}
        {visibleStack.length > 0 && (
          <div>
            {expanded && (
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                Tech Stack
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {visibleStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}

              {!expanded &&
                project.techStack?.length > visibleStack.length && (
                  <span className="text-xs text-slate-400">
                    +{project.techStack.length - visibleStack.length}
                  </span>
                )}
            </div>
          </div>
        )}

        {/* TAGS */}
        {visibleTags.length > 0 && (
          <div>
            {expanded && (
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                Tags
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}

              {!expanded && project.tags?.length > visibleTags.length && (
                <span className="text-xs text-slate-400">
                  +{project.tags.length - visibleTags.length}
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA (optional, still useful) */}
        <button
          onClick={() => navigate(`/projects/${project._id}`)}
          className="text-sm font-medium text-primary hover:underline pt-2"
        >
          Open project →
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
