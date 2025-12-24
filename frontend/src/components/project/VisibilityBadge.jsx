import Tag from '@/components/common/Tag';

const VisibilityBadge = ({ visibility }) => {
  return (
    <Tag variant={visibility === 'public' ? 'primary' : 'default'}>
      {visibility === 'public' ? 'Public' : 'Private'}
    </Tag>
  );
};

export default VisibilityBadge;
