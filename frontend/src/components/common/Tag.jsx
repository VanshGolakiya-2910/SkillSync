import clsx from 'clsx';

const Tag = ({
  children,
  variant = 'default',
  size = 'sm',
}) => {
  const base =
    'inline-flex items-center rounded-full font-medium';

  const variants = {
    default: 'bg-slate-200 text-slate-700',
    primary: 'bg-indigo-100 text-indigo-700',
    ghost: 'bg-transparent text-slate-600 border',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={clsx(base, variants[variant], sizes[size])}>
      {children}
    </span>
  );
};

export default Tag;
