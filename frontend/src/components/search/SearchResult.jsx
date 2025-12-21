import { Link } from 'react-router-dom';

const SearchResult = ({ item }) => {
  // You can refine this based on backend response shape
  const isUser = item.email;

  if (isUser) {
    return (
      <Link
        to={`/profile/${item._id}`}
        className="block border p-3 rounded hover:bg-slate-50"
      >
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-slate-600">{item.email}</div>
      </Link>
    );
  }

  return (
    <Link
      to={`/projects/${item._id}`}
      className="block border p-3 rounded hover:bg-slate-50"
    >
      <div className="font-medium">{item.title}</div>
      <div className="text-sm text-slate-600 line-clamp-1">
        {item.description}
      </div>
    </Link>
  );
};

export default SearchResult;
