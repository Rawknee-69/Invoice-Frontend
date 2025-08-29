import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EstimateSkeletonProps {
  count?: number;
  showFilters?: boolean;
  showTotalValue?: boolean;
}

const EstimateSkeleton: React.FC<EstimateSkeletonProps> = ({ 
  count = 5, 
  showFilters = true,
  showTotalValue = true 
}) => {
  return (
    <div className="p-4 md:p-6">
      {/* Filter Tabs Skeleton */}
      {showFilters && (
        <div className="mb-6">
          <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
            {['all', 'draft', 'sent', 'accepted', 'declined', 'expired'].map((filter) => (
              <div
                key={filter}
                className="h-8 w-16 bg-muted animate-pulse rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Total Value Skeleton */}
      {showTotalValue && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 bg-muted animate-pulse rounded" />
            <div className="h-8 w-40 bg-muted animate-pulse rounded" />
          </div>
        </div>
      )}

      {/* Desktop Table View Skeleton */}
      <div className="hidden md:block bg-background rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </th>
                <th className="text-left px-4 py-2">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </th>
                <th className="text-left px-4 py-2">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </th>
                <th className="text-right px-4 py-2">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded ml-auto" />
                </th>
                <th className="text-right px-4 py-2">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }).map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-5 w-12 bg-muted animate-pulse rounded-full" />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="h-4 w-4 bg-muted animate-pulse rounded ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Desktop Footer Message Skeleton */}
        <div className="p-4 text-center border-t bg-muted/20">
          <div className="h-3 w-48 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </div>

      {/* Mobile Card View Skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: Math.ceil(count / 2) }).map((_, yearIndex) => (
          <div key={yearIndex} className="space-y-2">
            {/* Year Header Skeleton */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                <div className="text-right">
                  <div className="h-3 w-8 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>

            {/* Estimate Cards Skeleton */}
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-background rounded-lg border shadow-sm p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        <div className="h-5 w-12 bg-muted animate-pulse rounded-full" />
                      </div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Mobile Footer Message Skeleton */}
        <div className="text-center py-6">
          <div className="h-3 w-48 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default EstimateSkeleton;

