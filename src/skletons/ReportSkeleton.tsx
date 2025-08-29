import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ReportSkeletonProps {
  showHeader?: boolean;
  showMetrics?: boolean;
  showCharts?: boolean;
  showTable?: boolean;
}

const ReportSkeleton: React.FC<ReportSkeletonProps> = ({ 
  showHeader = true,
  showMetrics = true,
  showCharts = true,
  showTable = true 
}) => {
  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-28 bg-muted animate-pulse rounded" />
          </div>
        </div>
      )}

      {/* Metrics Cards Skeleton */}
      {showMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-6 w-24 bg-muted animate-pulse rounded mb-1" />
                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts Section Skeleton */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Chart 1 */}
          <Card>
            <CardHeader>
              <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>

          {/* Chart 2 */}
          <Card>
            <CardHeader>
              <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>

          {/* Full Width Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Table Skeleton */}
      {showTable && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </th>
                    <th className="text-left py-2">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </th>
                    <th className="text-left py-2">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </th>
                    <th className="text-left py-2">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </th>
                    <th className="text-left py-2">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </th>
                    <th className="text-left py-2">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="py-3">
                        <div className="h-5 w-12 bg-muted animate-pulse rounded-full" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-5 w-24 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-2">
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
};

export default ReportSkeleton;

