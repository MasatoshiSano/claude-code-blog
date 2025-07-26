interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader = ({
  width = "w-full",
  height = "h-4",
  className,
}: SkeletonLoaderProps) => {
  return <div className={`skeleton ${width} ${height} ${className || ""}`} />;
};

interface BlogCardSkeletonProps {
  showExcerpt?: boolean;
}

export const BlogCardSkeleton = ({
  showExcerpt = true,
}: BlogCardSkeletonProps) => {
  return (
    <div className="card p-6 space-y-4">
      <SkeletonLoader height="h-6" width="w-3/4" />
      {showExcerpt && <SkeletonLoader height="h-4" />}
      <SkeletonLoader height="h-4" width="w-1/2" />
      <div className="flex space-x-2">
        <SkeletonLoader height="h-6" width="w-16" />
        <SkeletonLoader height="h-6" width="w-16" />
        <SkeletonLoader height="h-6" width="w-16" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
