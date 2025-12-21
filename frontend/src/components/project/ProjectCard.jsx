import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="border rounded-lg p-4 hover:shadow transition"
    >
      <h2 className="font-semibold text-lg">{project.title}</h2>
      <p className="text-sm text-slate-600 line-clamp-2">
        {project.description}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {project.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-slate-100 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default ProjectCard;
