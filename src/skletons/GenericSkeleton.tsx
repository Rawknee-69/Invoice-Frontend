import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GenericSkeletonProps {
  type?: 'card' | 'list' | 'form' | 'table' | 'grid';
  count?: number;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const GenericSkeleton: React.FC<GenericSkeletonProps> = ({ 
  type = 'card',
  count = 3,
  className = '',
  showHeader = false,
  showFooter = false 
}) => {
  const renderCardSkeleton = () => (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-5 w-24 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showFooter && (
        <div className="flex justify-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
      )}
    </div>
  );

  const renderListSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {showHeader && (
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      )}
      
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-3 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        </div>
      ))}

      {showFooter && (
        <div className="flex justify-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
      )}
    </div>
  );

  const renderFormSkeleton = () => (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      )}
      
      <Card>
        <CardHeader>
          <div className="h-5 w-24 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showFooter && (
        <div className="flex justify-end space-x-2">
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
      )}
    </div>
  );

  const renderTableSkeleton = () => (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      )}
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <th key={index} className="text-left p-4">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: count }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {Array.from({ length: 4 }).map((_, colIndex) => (
                      <td key={colIndex} className="p-4">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showFooter && (
        <div className="flex justify-center space-x-2">
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
      )}
    </div>
  );

  const renderGridSkeleton = () => (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-32 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      {showFooter && (
        <div className="flex justify-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
      )}
    </div>
  );

  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'form':
      return renderFormSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'grid':
      return renderGridSkeleton();
    default:
      return renderCardSkeleton();
  }
};

export default GenericSkeleton;

