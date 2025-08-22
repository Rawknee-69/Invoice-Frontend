import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Upload, Camera, Edit, Trash2, Eye, TrendingUp, DollarSign, Calendar, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { expenseApi } from '@/utils/api';
import ExpenseStats from './ExpenseStats';
import ReceiptScanner from './ReceiptScanner';
import { ReceiptImage } from '@/components/ui/receipt-image';

interface Expense {
  id: string;
  description: string;
  total: number;
  tax: number;
  date: string;
  category: string;
  merchantName?: string;
  receiptImage?: string;
  receiptImageUrl?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ExpenseStats {
  year: number;
  totalAmount: number;
  totalTax: number;
  totalCount: number;
  monthlyTrend: number;
  byCategory: Array<{ category: string; total: number; tax: number; count: number }>;
  byMonth: Array<{ month: number; total: number; tax: number; count: number }>;
}

interface ExpenseFormData {
  description: string;
  amount: string;
  date: string;
  category: string;
  merchantName: string;
  notes: string;
  receiptImageUrl?: string;
}

const EXPENSE_CATEGORIES = [
  'Office Supplies', 'Travel', 'Meals & Entertainment', 'Equipment',
  'Software & Subscriptions', 'Marketing', 'Utilities', 'Rent',
  'Professional Services', 'Training & Education', 'Other'
];

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [categories, setCategories] = useState<string[]>(EXPENSE_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Dialogs and forms
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReceiptScanOpen, setIsReceiptScanOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    merchantName: '',
    notes: ''
  });
  
  // Receipt scanning
  const [isScanning, setIsScanning] = useState(false);
  
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Fetch expenses with filters
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await expenseApi.getAll(params);
      if (response.error) {
        setError(response.error.message);
      } else {
        const data = response.data as any;
        // Backend returns { data: expenses[], pagination: {...} }
        setExpenses(data?.data || []);
        console.log('Expenses fetched:', data?.data?.length || 0, 'expenses');
      }
    } catch (err) {
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, dateFrom, dateTo, page, limit]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await expenseApi.getStats();
      if (response.data) {
        setStats(response.data as ExpenseStats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await expenseApi.getCategories();
      const data = response.data as any;
      if (data?.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchStats();
    fetchCategories();
  }, [fetchExpenses, fetchStats, fetchCategories]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date)
      };

      let response;
      if (selectedExpense) {
        response = await expenseApi.update(selectedExpense.id, expenseData);
      } else {
        response = await expenseApi.create(expenseData);
      }

      if (response.error) {
        setError(response.error.message);
      } else {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setFormData({
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          category: '',
          merchantName: '',
          notes: ''
        });
        setSelectedExpense(null);
        fetchExpenses();
        fetchStats();
      }
    } catch (err) {
      setError('Failed to save expense');
    }
  };

  // Handle file upload for receipt scanning
  const handleFileUpload = async (file: File) => {
    try {
      setIsScanning(true);
      
      // Upload file
      const uploadResponse = await expenseApi.upload(file);
      if (uploadResponse.error) {
        setError(uploadResponse.error.message);
        return;
      }

      const uploadData = uploadResponse.data as any;
      
      // Use presigned URL for display, original URL for scanning
      const displayUrl = uploadData.presignedUrl || uploadData.imageUrl;
      const scanUrl = uploadData.imageUrl;
      
      // Scan and populate
      const scanResponse = await expenseApi.scanAndPopulate(scanUrl);
      if (scanResponse.error) {
        setError(scanResponse.error.message);
        return;
      }

      const scanData = scanResponse.data as any;
      
      // Auto-populate form with scan results
      if (scanData.populatedFields) {
        const fields = scanData.populatedFields;
        setFormData(prev => ({
          ...prev,
          description: fields.description || prev.description,
          amount: fields.amount?.toString() || prev.amount,
          date: fields.date ? new Date(fields.date).toISOString().split('T')[0] : prev.date,
          category: fields.category || prev.category,
          merchantName: fields.merchantName || prev.merchantName,
          receiptImageUrl: displayUrl
        }));
      }
    } catch (err) {
      setError('Failed to scan receipt');
    } finally {
      setIsScanning(false);
    }
  };

  // Handle delete expense
  const handleDeleteConfirm = (expenseId: string) => {
    setExpenseToDelete(expenseId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    
    try {
      const response = await expenseApi.delete(expenseToDelete);
      if (response.error) {
        setError(response.error.message);
      } else {
        fetchExpenses();
        fetchStats();
        setDeleteConfirmOpen(false);
        setExpenseToDelete(null);
      }
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  // Handle edit expense
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.total.toString(),
      date: new Date(expense.date).toISOString().split('T')[0],
      category: expense.category,
      merchantName: expense.merchantName || '',
      notes: expense.notes || '',
      receiptImageUrl: expense.receiptImageUrl
    });
    setIsEditDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

    return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track and manage your business expenses</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto"
            onClick={() => setIsStatsOpen(true)}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto"
            onClick={() => setIsReceiptScanOpen(true)}
          >
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Scan Receipt</span>
            <span className="sm:hidden">Scan</span>
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setError(null)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                <span className="hidden sm:inline">Total Expenses</span>
                <span className="sm:hidden">Total</span>
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                <span className="hidden sm:inline">This Month</span>
                <span className="sm:hidden">Month</span>
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {formatCurrency(
                  stats.byMonth?.find(m => m.month === new Date().getMonth() + 1)?.total || 
                  stats.byMonth?.reduce((sum, month) => sum + month.total, 0) / 12 || 0
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Categories</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.byCategory?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-lg sm:text-2xl font-bold ${stats.monthlyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.monthlyTrend >= 0 ? '+' : ''}{stats.monthlyTrend.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              placeholder="From Date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            
            <Input
              type="date"
              placeholder="To Date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            
            <Button 
              variant="outline" 
              className="sm:col-span-1 lg:col-span-1"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setDateFrom('');
                setDateTo('');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>
            Showing {expenses.length} expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expenses found</p>
              <Button 
                className="mt-4" 
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Add Your First Expense
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[150px]">Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Merchant</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">Receipt</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="text-sm">{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-sm">{expense.description}</span>
                        <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                          <Badge variant="secondary" className="text-xs">{expense.category}</Badge>
                          {expense.merchantName && (
                            <Badge variant="outline" className="text-xs">{expense.merchantName}</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{expense.merchantName || '-'}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatCurrency(expense.total)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (expense.receiptImageUrl || expense.receiptImage) {
                            window.open(expense.receiptImageUrl || expense.receiptImage, '_blank');
                          }
                        }}
                        disabled={!(expense.receiptImageUrl || expense.receiptImage)}
                        className={`${
                          (expense.receiptImageUrl || expense.receiptImage) 
                            ? 'text-blue-600 hover:text-blue-800 cursor-pointer' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            •••
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(expense)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="lg:hidden"
                            disabled={!(expense.receiptImageUrl || expense.receiptImage)}
                            onClick={() => {
                              if (expense.receiptImageUrl || expense.receiptImage) {
                                window.open(expense.receiptImageUrl || expense.receiptImage, '_blank');
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {(expense.receiptImageUrl || expense.receiptImage) ? 'View Receipt' : 'No Receipt'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            variant="destructive"
                            onClick={() => handleDeleteConfirm(expense.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {expenses.length > 0 && (
        <div className="flex justify-center items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-3 py-1 text-sm">Page {page}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={expenses.length < limit}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create/Edit Expense Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedExpense(null);
          setFormData({
            description: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            category: '',
            merchantName: '',
            notes: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide mx-2 sm:mx-4 md:mx-auto w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-full">
          <DialogHeader>
            <DialogTitle>
              {selectedExpense ? 'Edit Expense' : 'Add New Expense'}
            </DialogTitle>
            <DialogDescription>
              {selectedExpense ? 'Update the expense details below' : 'Fill in the details for your new expense'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Expense description"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Merchant Name</label>
                <Input
                  value={formData.merchantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, merchantName: e.target.value }))}
                  placeholder="Store or vendor name"
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this expense"
                  rows={3}
                />
              </div>
              
              {/* Receipt Upload */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Receipt</label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                    <div className="mt-2 sm:mt-4">
                      <label htmlFor="receipt-upload" className="cursor-pointer">
                        <span className="mt-1 sm:mt-2 block text-xs sm:text-sm font-medium">
                          Drop receipt here or click to upload
                        </span>
                        <input
                          id="receipt-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                        />
                      </label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG, WebP up to 10MB
                      </p>
                    </div>
                    {isScanning && (
                      <div className="mt-3 sm:mt-4">
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Scanning receipt...</p>
                      </div>
                    )}
                    {formData.receiptImageUrl && (
                      <div className="mt-3 sm:mt-4">
                        <ReceiptImage
                          src={formData.receiptImageUrl} 
                          alt="Receipt" 
                          className="max-h-24 sm:max-h-32 mx-auto rounded border cursor-pointer hover:opacity-80"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {selectedExpense ? 'Update Expense' : 'Create Expense'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Receipt Scanner */}
      <ReceiptScanner
        isOpen={isReceiptScanOpen}
        onClose={() => setIsReceiptScanOpen(false)}
        onExpenseCreated={() => {
          fetchExpenses();
          fetchStats();
        }}
        categories={categories}
      />

      {/* Expense Analytics */}
      <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expense Analytics</DialogTitle>
            <DialogDescription>
              Detailed insights into your expense patterns and trends
            </DialogDescription>
          </DialogHeader>
          <ExpenseStats />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Expense
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteConfirmOpen(false);
                setExpenseToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
