import React, { useState, useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { expenseApi } from '@/utils/api';

interface ScanResult {
  merchantName?: string;
  amount?: number;
  date?: string;
  description?: string;
  category?: string;
  confidence: number;
  rawText?: string;
}

interface ValidationResult {
  isValid: boolean;
  issues: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

interface ReceiptScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseCreated: (expense: any) => void;
  categories: string[];
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({
  isOpen,
  onClose,
  onExpenseCreated,
  categories
}) => {
  const [step, setStep] = useState<'upload' | 'scan' | 'review' | 'correct'>('upload');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string>('');
  
  // Form data for correction
  const [correctedData, setCorrectedData] = useState({
    merchantName: '',
    amount: '',
    date: '',
    description: '',
    category: '',
    notes: ''
  });

  const resetState = () => {
    setStep('upload');
    setImageUrl('');
    setScanResult(null);
    setValidation(null);
    setError('');
    setCorrectedData({
      merchantName: '',
      amount: '',
      date: '',
      description: '',
      category: '',
      notes: ''
    });
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please select a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Please select an image under 10MB.');
      return;
    }

    setError('');
    setStep('scan');
    handleScan(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleScan = async (fileToScan: File) => {
    try {
      setError('');

      // Upload file
      const uploadResponse = await expenseApi.upload(fileToScan);
      if (uploadResponse.error) {
        setError(uploadResponse.error.message);
        return;
      }

      const uploadedImageUrl = (uploadResponse.data as any).imageUrl;
      setImageUrl(uploadedImageUrl);

      // Scan and populate
      const scanResponse = await expenseApi.scanAndPopulate(uploadedImageUrl);
      if (scanResponse.error) {
        setError(scanResponse.error.message);
        return;
      }

      setScanResult((scanResponse.data as any).scanResult);
      setValidation((scanResponse.data as any).validation);

      // Populate correction form with scan results
      const fields = (scanResponse.data as any).populatedFields || {};
      setCorrectedData({
        merchantName: fields.merchantName || '',
        amount: fields.amount?.toString() || '',
        date: fields.date ? new Date(fields.date).toISOString().split('T')[0] : '',
        description: fields.description || '',
        category: fields.category || '',
        notes: ''
      });

      setStep('review');
    } catch (err) {
      setError('Failed to scan receipt. Please try again.');
    }
  };



  const handleCreateExpense = async () => {
    try {
      const expenseData = {
        description: correctedData.description,
        amount: parseFloat(correctedData.amount),
        date: new Date(correctedData.date),
        category: correctedData.category,
        merchantName: correctedData.merchantName,
        notes: correctedData.notes,
        receiptImageUrl: imageUrl
      };

      const response = await expenseApi.create(expenseData);
      if (response.error) {
        setError(response.error.message);
        return;
      }

      onExpenseCreated(response.data);
      handleClose();
    } catch (err) {
      setError('Failed to create expense.');
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scan Receipt</DialogTitle>
          <DialogDescription>
            Upload a receipt image to automatically extract expense information
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <label htmlFor="receipt-file" className="cursor-pointer">
                        <span className="text-lg font-medium">
                          Drop receipt here or click to upload
                        </span>
                        <input
                          id="receipt-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) handleFileSelect(selectedFile);
                          }}
                        />
                      </label>
                      <p className="mt-2 text-sm text-muted-foreground">
                        PNG, JPG, WebP up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scanning Step */}
        {step === 'scan' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-lg font-medium">Scanning receipt...</p>
                  <p className="text-sm text-muted-foreground">
                    Extracting text and analyzing expense data
                  </p>
                  {imageUrl && (
                    <div className="mt-4">
                      <img 
                        src={imageUrl} 
                        alt="Receipt" 
                        className="max-h-48 mx-auto rounded border"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Review Step */}
        {step === 'review' && scanResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Receipt Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Receipt Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt="Receipt" 
                      className="w-full rounded border"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Extracted Data */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Extracted Data</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={scanResult.confidence >= 0.8 ? 'success' : 
                               scanResult.confidence >= 0.6 ? 'warning' : 'destructive'}
                      >
                        {getConfidenceLabel(scanResult.confidence)} Confidence
                      </Badge>
                      <span className={`text-sm ${getConfidenceColor(scanResult.confidence)}`}>
                        {(scanResult.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium">Merchant</label>
                      <p className="text-sm">{scanResult.merchantName || 'Not detected'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <p className="text-sm">
                        {scanResult.amount ? `$${scanResult.amount.toFixed(2)}` : 'Not detected'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <p className="text-sm">
                        {scanResult.date ? new Date(scanResult.date).toLocaleDateString() : 'Not detected'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-sm">{scanResult.description || 'Not detected'}</p>
                    </div>
                  </div>

                  {/* Validation Issues */}
                  {validation && validation.issues.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Issues Found</label>
                      {validation.issues.map((issue, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertCircle className={`h-4 w-4 ${
                            issue.severity === 'error' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                          <span className="text-sm">{issue.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Correction Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review & Correct</CardTitle>
                <CardDescription>
                  Verify and correct the extracted information before creating the expense
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description *</label>
                    <Input
                      value={correctedData.description}
                      onChange={(e) => setCorrectedData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Expense description"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={correctedData.amount}
                      onChange={(e) => setCorrectedData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date *</label>
                    <Input
                      type="date"
                      value={correctedData.date}
                      onChange={(e) => setCorrectedData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <Select 
                      value={correctedData.category} 
                      onValueChange={(value) => setCorrectedData(prev => ({ ...prev, category: value }))}
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
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Merchant Name</label>
                    <Input
                      value={correctedData.merchantName}
                      onChange={(e) => setCorrectedData(prev => ({ ...prev, merchantName: e.target.value }))}
                      placeholder="Store or vendor name"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={correctedData.notes}
                      onChange={(e) => setCorrectedData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          
          {step === 'scan' && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          
          {step === 'review' && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Scan Another
              </Button>
              <Button 
                onClick={handleCreateExpense}
                disabled={!correctedData.description || !correctedData.amount || !correctedData.date || !correctedData.category}
              >
                Create Expense
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptScanner;
