import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpenseSkeletonProps {
  count?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  showStats?: boolean;
}

const ExpenseSkeleton: React.FC<ExpenseSkeletonProps> = ({ 
  count = 5, 
  showHeader = true,
  showFilters = true,
  showStats = true 
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
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      )}

      {/* Filters Skeleton - Collapsible Card */}
      {showFilters && (
        <Card>
          <CardHeader 
            className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                <div className="h-5 w-12 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="h-6 w-6 bg-muted animate-pulse rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="relative">
                  <div className="h-10 w-full bg-muted animate-pulse rounded" />
                </div>
              </div>
              
              {/* Category */}
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
              
              {/* From Date */}
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
              
              {/* To Date */}
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
              
              {/* Clear Filters */}
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards Skeleton */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Expenses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
          
          {/* This Month */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
          
          {/* Categories */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
          
          {/* Trend */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expenses Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-40 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 min-w-[100px]">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                  </th>
                  <th className="text-left py-2 min-w-[150px]">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </th>
                  <th className="hidden sm:table-cell text-left py-2">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </th>
                  <th className="hidden md:table-cell text-left py-2">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </th>
                  <th className="text-left py-2 min-w-[100px]">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </th>
                  <th className="hidden lg:table-cell text-left py-2">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </th>
                  <th className="text-left py-2 min-w-[80px]">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: count }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </td>
                    <td className="py-3">
                      <div className="space-y-1">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="flex flex-wrap gap-1 sm:hidden">
                          <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                          <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-3">
                      <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                    </td>
                    <td className="hidden md:table-cell py-3">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded font-mono" />
                    </td>
                    <td className="hidden lg:table-cell py-3">
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    </td>
                    <td className="py-3">
                      <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-2">
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
};

export default ExpenseSkeleton;

