import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PostSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Skeleton circle width={48} height={48} />
        <div className="flex-1">
          <Skeleton width={120} />
          <Skeleton width={80} />
        </div>
      </div>
      <Skeleton width="80%" height={32} className="mb-4" />
      <Skeleton count={4} className="mb-2" />

      <div className="flex justify-between items-center mt-6">
        <div className="flex space-x-4">
          <Skeleton width={60} />
          <Skeleton width={80} />
        </div>
        <Skeleton width={100} />
      </div>
    </div>
  );
}
