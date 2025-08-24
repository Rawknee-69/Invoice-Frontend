import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  InvoiceSkeleton, 
  ExpenseSkeleton, 
  EstimateSkeleton, 
  ReportSkeleton, 
  GenericSkeleton 
} from './index';

const SkeletonDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('invoice');

  const demos = [
    { id: 'invoice', name: 'Invoice Skeleton', component: <InvoiceSkeleton count={8} /> },
    { id: 'expense', name: 'Expense Skeleton', component: <ExpenseSkeleton count={6} /> },
    { id: 'estimate', name: 'Estimate Skeleton', component: <EstimateSkeleton count={7} /> },
    { id: 'report', name: 'Report Skeleton', component: <ReportSkeleton /> },
    { id: 'generic-card', name: 'Generic Card Skeleton', component: <GenericSkeleton type="card" count={6} showHeader /> },
    { id: 'generic-list', name: 'Generic List Skeleton', component: <GenericSkeleton type="list" count={5} showHeader /> },
    { id: 'generic-form', name: 'Generic Form Skeleton', component: <GenericSkeleton type="form" count={4} showHeader showFooter /> },
    { id: 'generic-table', name: 'Generic Table Skeleton', component: <GenericSkeleton type="table" count={6} showHeader showFooter /> },
    { id: 'generic-grid', name: 'Generic Grid Skeleton', component: <GenericSkeleton type="grid" count={8} showHeader /> },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Skeleton Components Demo</h1>
        <p className="text-muted-foreground">
          Showcasing loading state skeletons that match your app's design patterns
        </p>
      </div>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Choose a Skeleton Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {demos.map((demo) => (
              <Button
                key={demo.id}
                variant={activeDemo === demo.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveDemo(demo.id)}
              >
                {demo.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Demo */}
      <Card>
        <CardHeader>
          <CardTitle>{demos.find(d => d.id === activeDemo)?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {demos.find(d => d.id === activeDemo)?.component}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Basic Usage:</h3>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`import { InvoiceSkeleton } from '@/skletons';

// In your component
if (loading) {
  return <InvoiceSkeleton count={5} />;
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Available Props:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">InvoiceSkeleton</h4>
                <ul className="text-sm space-y-1 mt-1">
                  <li>• count: number (default: 5)</li>
                  <li>• showFilters: boolean (default: true)</li>
                  <li>• showTotalBalance: boolean (default: true)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">ExpenseSkeleton</h4>
                <ul className="text-sm space-y-1 mt-1">
                  <li>• count: number (default: 5)</li>
                  <li>• showHeader: boolean (default: true)</li>
                  <li>• showFilters: boolean (default: true)</li>
                  <li>• showStats: boolean (default: true)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">GenericSkeleton</h4>
                <ul className="text-sm space-y-1 mt-1">
                  <li>• type: 'card' | 'list' | 'form' | 'table' | 'grid'</li>
                  <li>• count: number (default: 3)</li>
                  <li>• showHeader: boolean (default: false)</li>
                  <li>• showFooter: boolean (default: false)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">ReportSkeleton</h4>
                <ul className="text-sm space-y-1 mt-1">
                  <li>• showHeader: boolean (default: true)</li>
                  <li>• showMetrics: boolean (default: true)</li>
                  <li>• showCharts: boolean (default: true)</li>
                  <li>• showTable: boolean (default: true)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Design Features:</h3>
            <ul className="text-sm space-y-1">
              <li>• Responsive design that matches your app's layout</li>
              <li>• Smooth pulse animations using Tailwind's animate-pulse</li>
              <li>• Consistent spacing and typography</li>
              <li>• Mobile-first approach with desktop optimizations</li>
              <li>• Uses your existing UI components (Card, etc.)</li>
              <li>• Matches the muted color scheme of your design system</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonDemo;

