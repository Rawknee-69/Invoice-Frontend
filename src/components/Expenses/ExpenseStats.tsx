import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { expenseApi } from '@/utils/api';

interface CategoryStats {
  category: string;
  total: number;
  tax: number;
  count: number;
}

interface MonthlyStats {
  month: number;
  total: number;
  tax: number;
  count: number;
}

interface ExpenseStatsData {
  year: number;
  totalAmount: number;
  totalTax: number;
  totalCount: number;
  monthlyTrend: number;
  byCategory: CategoryStats[];
  byMonth: MonthlyStats[];
}

const COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-purple-500',
  'bg-teal-500', 'bg-pink-500', 'bg-red-500', 'bg-indigo-500', 'bg-gray-500'
];

const ExpenseStats: React.FC = () => {
  const [stats, setStats] = useState<ExpenseStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [viewMode, setViewMode] = useState<'overview' | 'categories' | 'trends'>('overview');

  useEffect(() => {
    fetchStats();
  }, [selectedYear]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedYear) params.append('year', selectedYear);
      
      const response = await expenseApi.getStats(params);
      if (response.data) {
        setStats(response.data as ExpenseStatsData);
      }
    } catch (error) {
      console.error('Failed to fetch expense stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived values (same logic as main Expenses component)
  const getCurrentMonthTotal = () => {
    if (!stats) return 0;
    return (
      stats.byMonth?.find(m => m.month === new Date().getMonth() + 1)?.total || 
      stats.byMonth?.reduce((sum, month) => sum + month.total, 0) / 12 || 0
    );
  };

  const getAverageExpense = () => {
    if (!stats || stats.totalCount === 0) return 0;
    return stats.totalAmount / stats.totalCount;
  };

  const getCategoryBreakdown = () => {
    if (!stats?.byCategory) return [];
    const total = stats.totalAmount;
    return stats.byCategory.map(category => ({
      ...category,
      percentage: total > 0 ? (category.total / total) * 100 : 0
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No statistics available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="categories">Categories</SelectItem>
              <SelectItem value="trends">Trends</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getCurrentMonthTotal())}</div>
              <p className="text-xs text-muted-foreground">
                {(() => {
                  const currentMonth = new Date().getMonth() + 1;
                  const currentMonthData = stats.byMonth?.find(m => m.month === currentMonth);
                  return currentMonthData?.total ? 'Current month' : 'Monthly average';
                })()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getAverageExpense())}</div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byCategory?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categories View */}
      {viewMode === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
              <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCategoryBreakdown().map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.category}</span>
                      <span>{category.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${COLORS[index % COLORS.length]}`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(category.total)}</span>
                      <span>{category.count} expenses</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category List */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Detailed view</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCategoryBreakdown().map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${COLORS[index % COLORS.length]}`} />
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-muted-foreground">{category.count} expenses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(category.total)}</p>
                      <Badge variant="secondary">{category.percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trends View */}
      {viewMode === 'trends' && (
        <div className="space-y-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
              <CardDescription>Expense amounts over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.byMonth?.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{new Date(2024, month.month - 1).toLocaleDateString('en-US', { month: 'long' })}</span>
                      <span>{formatCurrency(month.total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (month.total / Math.max(...(stats.byMonth || []).map(m => m.total))) * 100)}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {month.count} transactions
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Transaction Count */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Transaction Count</CardTitle>
              <CardDescription>Number of expenses over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.byMonth?.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{new Date(2024, month.month - 1).toLocaleDateString('en-US', { month: 'long' })}</span>
                      <span>{month.count} expenses</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (month.count / Math.max(...(stats.byMonth || []).map(m => m.count))) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


        </div>
      )}
    </div>
  );
};

export default ExpenseStats;
