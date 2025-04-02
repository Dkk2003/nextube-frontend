interface SkeletonType {
  className?: string;
}

const Skeleton = ({ className }: SkeletonType) => {
  return <div className={`skeleton-animation ${className}`} />;
};

export default Skeleton;
