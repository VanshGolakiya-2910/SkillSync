export const isProjectOwner = (user, project) => {
  if (!user || !project) return false;

  const ownerId =
    typeof project.owner === 'string'
      ? project.owner
      : project.owner?._id;

  return ownerId === user._id;
};
