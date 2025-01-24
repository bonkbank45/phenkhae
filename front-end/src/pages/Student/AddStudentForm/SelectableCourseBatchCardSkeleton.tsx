import React from 'react';

export const SelectableCourseBatchCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-boxdark border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-5 w-5 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="flex-1">
          {/* Course name */}
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" />

          <div className="space-y-2">
            {/* Batch number */}
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />

            {/* Date range */}
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3" />

            {/* Enrollment count */}
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />

            {/* Status badge */}
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
};
