import React, { useState, useEffect } from "react";
import { Plus, Trash2, Plus as PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invoiceApi, clientApi } from "@/utils/api";

interface Client {
  id: string;
  name: string;
  email: string;
}

interface CreateClientForm {
  name: string;
  email: string;
  mobile: string;
  address1: string;
  address2?: string;
  address3?: string;
}

interface InvoiceItem {
  title: string;
  description: string;
  unitCost: number;
  quantity: number;
  hasDiscount: boolean;
  discountType?: "PERCENTAGE" | "FLAT";
  discountAmount?: number;
  isTaxable: boolean;
  taxPercentage?: number;
  isTaxIncluded: boolean;
  additionalDetails?: string;
}

interface CreateInvoiceForm {
  clientId: string;
  date: string;
  dueDate: string;
  terms: "NET_15" | "NET_30" | "NET_45" | "NET_60" | "DUE_ON_RECEIPT" | "CUSTOM";
  poNumber: string;
  template: string;
  notes: string;
  items: InvoiceItem[];
}

const CreateInvoiceModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Client creation modal state
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [creatingClient, setCreatingClient] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [clientForm, setClientForm] = useState<CreateClientForm>({
    name: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    address3: "",
  });
  
  const [form, setForm] = useState<CreateInvoiceForm>({
    clientId: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    terms: "NET_30",
    poNumber: "",
    template: "modern",
    notes: "",
    items: [
      {
        title: "",
        description: "",
        unitCost: 0,
        quantity: 1,
        hasDiscount: false,
        isTaxable: false,
        isTaxIncluded: false,
      }
    ]
  });

  // Fetch clients when modal opens
  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

  const fetchClients = async () => {
    try {
      setClientsLoading(true);
      const response = await clientApi.getAll();
      if (response.data) {
        // Handle both paginated and non-paginated responses
        const clientsData = (response.data as any).data || response.data;
        setClients(Array.isArray(clientsData) ? clientsData : []);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setClientsLoading(false);
    }
  };

  const validateClientForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientForm.name.trim()) {
      newErrors.name = "Client name is required";
    }
    if (!clientForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!clientForm.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    }
    if (!clientForm.address1.trim()) {
      newErrors.address1 = "Address is required";
    }

    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateClient = async () => {
    if (!validateClientForm()) {
      return;
    }

    setCreatingClient(true);
    try {
      const response = await clientApi.create(clientForm);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      // Add the new client to the list
      const newClient = response.data as Client;
      setClients(prev => [...prev, newClient]);
      
      // Select the newly created client
      setForm(prev => ({ ...prev, clientId: newClient.id }));
      
      // Reset client form and close modal
      setClientForm({
        name: "",
        email: "",
        mobile: "",
        address1: "",
        address2: "",
        address3: "",
      });
      setClientErrors({});
      setShowCreateClient(false);
      
    } catch (error) {
      console.error("Failed to create client:", error);
      setClientErrors({ submit: error instanceof Error ? error.message : "Failed to create client" });
    } finally {
      setCreatingClient(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate client
    if (!form.clientId) {
      newErrors.clientId = "Client is required";
    }

    // Validate items
    if (form.items.length === 0) {
      newErrors.items = "At least one item is required";
    } else {
      form.items.forEach((item, index) => {
        if (!item.title.trim()) {
          newErrors[`items.${index}.title`] = "Item title is required";
        }
        if (!item.description.trim()) {
          newErrors[`items.${index}.description`] = "Item description is required";
        }
        if (item.unitCost <= 0) {
          newErrors[`items.${index}.unitCost`] = "Unit cost must be greater than 0";
        }
        if (item.quantity <= 0) {
          newErrors[`items.${index}.quantity`] = "Quantity must be greater than 0";
        }
        if (item.hasDiscount && !item.discountAmount) {
          newErrors[`items.${index}.discountAmount`] = "Discount amount is required when discount is enabled";
        }
        if (item.isTaxable && !item.taxPercentage) {
          newErrors[`items.${index}.taxPercentage`] = "Tax percentage is required when tax is enabled";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Calculate due date if not provided
      let dueDate = form.dueDate;
      if (!dueDate && form.terms !== "CUSTOM") {
        const invoiceDate = new Date(form.date);
        const daysToAdd = {
          NET_15: 15,
          NET_30: 30,
          NET_45: 45,
          NET_60: 60,
          DUE_ON_RECEIPT: 0,
        }[form.terms] || 30;
        
        if (daysToAdd > 0) {
          dueDate = new Date(invoiceDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        } else {
          dueDate = form.date;
        }
      }

      const invoiceData = {
        clientId: form.clientId,
        date: new Date(form.date),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        terms: form.terms,
        poNumber: form.poNumber || undefined,
        template: form.template,
        notes: form.notes || undefined,
        items: form.items.map(item => ({
          ...item,
          discountType: item.hasDiscount ? item.discountType : undefined,
          discountAmount: item.hasDiscount ? item.discountAmount : undefined,
          taxPercentage: item.isTaxable ? item.taxPercentage : undefined,
          additionalDetails: item.additionalDetails || undefined,
        }))
      };

      const response = await invoiceApi.create(invoiceData);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      // Reset form and close modal
      setForm({
        clientId: "",
        date: new Date().toISOString().split('T')[0],
        dueDate: "",
        terms: "NET_30",
        poNumber: "",
        template: "modern",
        notes: "",
        items: [
          {
            title: "",
            description: "",
            unitCost: 0,
            quantity: 1,
            hasDiscount: false,
            isTaxable: false,
            isTaxIncluded: false,
          }
        ]
      });
      setErrors({});
      setOpen(false);
      
      // Refresh the page or trigger a callback to update the invoice list
      window.location.reload();
    } catch (error) {
      console.error("Failed to create invoice:", error);
      setErrors({ submit: error instanceof Error ? error.message : "Failed to create invoice" });
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          title: "",
          description: "",
          unitCost: 0,
          quantity: 1,
          hasDiscount: false,
          isTaxable: false,
          isTaxIncluded: false,
        }
      ]
    }));
  };

  const removeItem = (index: number) => {
    if (form.items.length > 1) {
      setForm(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateItemTotal = (item: InvoiceItem): number => {
    let total = item.unitCost * item.quantity;
    
    if (item.hasDiscount && item.discountAmount) {
      if (item.discountType === "PERCENTAGE") {
        total -= (total * item.discountAmount) / 100;
      } else {
        total -= item.discountAmount;
      }
    }
    
    if (item.isTaxable && item.taxPercentage) {
      if (item.isTaxIncluded) {
        // Tax is already included in the price
        return total;
      } else {
        total += (total * item.taxPercentage) / 100;
      }
    }
    
    return total;
  };

  const calculateInvoiceTotal = (): number => {
    return form.items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            size="icon" 
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Create New Invoice
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the details below to create a new invoice for your client.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Client Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Client *</label>
              {clientsLoading ? (
                <div className="w-full p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Loading clients...</span>
                  </div>
                </div>
              ) : clients.length === 0 ? (
                <div className="w-full p-3 border rounded-md bg-muted/20">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <span className="text-sm text-muted-foreground">No clients found</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateClient(true)}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Create New Client
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Select 
                    value={form.clientId} 
                    onValueChange={(value) => setForm(prev => ({ ...prev, clientId: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{client.name}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateClient(true)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Create New Client
                  </Button>
                </div>
              )}
              {errors.clientId && (
                <p className="text-sm text-destructive">{errors.clientId}</p>
              )}
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Invoice Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Due Date</label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full"
                  min={form.date}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Payment Terms</label>
                <Select 
                  value={form.terms} 
                  onValueChange={(value: any) => setForm(prev => ({ ...prev, terms: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NET_15">Net 15</SelectItem>
                    <SelectItem value="NET_30">Net 30</SelectItem>
                    <SelectItem value="NET_45">Net 45</SelectItem>
                    <SelectItem value="NET_60">Net 60</SelectItem>
                    <SelectItem value="DUE_ON_RECEIPT">Due on Receipt</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* PO Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">PO Number (Optional)</label>
              <Input
                value={form.poNumber}
                onChange={(e) => setForm(prev => ({ ...prev, poNumber: e.target.value }))}
                placeholder="Enter PO number"
                className="w-full"
              />
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Invoice Items *</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              {errors.items && (
                <p className="text-sm text-destructive">{errors.items}</p>
              )}

              <div className="space-y-4">
                {form.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-foreground">Item {index + 1}</h4>
                      {form.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Title *</label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateItem(index, 'title', e.target.value)}
                          placeholder="Item title"
                          className="w-full"
                        />
                        {errors[`items.${index}.title`] && (
                          <p className="text-sm text-destructive">{errors[`items.${index}.title`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Description *</label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          className="w-full"
                        />
                        {errors[`items.${index}.description`] && (
                          <p className="text-sm text-destructive">{errors[`items.${index}.description`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Unit Cost *</label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitCost}
                          onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full"
                        />
                        {errors[`items.${index}.unitCost`] && (
                          <p className="text-sm text-destructive">{errors[`items.${index}.unitCost`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Quantity *</label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          placeholder="1"
                          className="w-full"
                        />
                        {errors[`items.${index}.quantity`] && (
                          <p className="text-sm text-destructive">{errors[`items.${index}.quantity`]}</p>
                        )}
                      </div>
                    </div>

                    {/* Discount Section */}
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`discount-${index}`}
                          checked={item.hasDiscount}
                          onChange={(e) => updateItem(index, 'hasDiscount', e.target.checked)}
                          className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                        <label htmlFor={`discount-${index}`} className="text-sm font-medium text-foreground">
                          Apply Discount
                        </label>
                      </div>

                      {item.hasDiscount && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Discount Type</label>
                            <Select 
                              value={item.discountType || "PERCENTAGE"} 
                              onValueChange={(value: "PERCENTAGE" | "FLAT") => updateItem(index, 'discountType', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                <SelectItem value="FLAT">Flat Amount</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Discount Amount *</label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.discountAmount || ""}
                              onChange={(e) => updateItem(index, 'discountAmount', parseFloat(e.target.value) || 0)}
                              placeholder={item.discountType === "PERCENTAGE" ? "0" : "0.00"}
                              className="w-full"
                            />
                            {errors[`items.${index}.discountAmount`] && (
                              <p className="text-sm text-destructive">{errors[`items.${index}.discountAmount`]}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tax Section */}
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`tax-${index}`}
                          checked={item.isTaxable}
                          onChange={(e) => updateItem(index, 'isTaxable', e.target.checked)}
                          className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                        <label htmlFor={`tax-${index}`} className="text-sm font-medium text-foreground">
                          Apply Tax
                        </label>
                      </div>

                      {item.isTaxable && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Tax Percentage *</label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={item.taxPercentage || ""}
                              onChange={(e) => updateItem(index, 'taxPercentage', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="w-full"
                            />
                            {errors[`items.${index}.taxPercentage`] && (
                              <p className="text-sm text-destructive">{errors[`items.${index}.taxPercentage`]}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`tax-included-${index}`}
                              checked={item.isTaxIncluded}
                              onChange={(e) => updateItem(index, 'isTaxIncluded', e.target.checked)}
                              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                            <label htmlFor={`tax-included-${index}`} className="text-sm text-foreground">
                              Tax included in price
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Item Total */}
                    <div className="mt-4 p-3 bg-background rounded border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Item Total:</span>
                        <span className="text-lg font-semibold text-foreground">
                          ₹{calculateItemTotal(item).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes (Optional)</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full"
              />
            </div>

            {/* Invoice Total */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Invoice Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{calculateInvoiceTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || clients.length === 0}
              className="min-w-[100px]"
            >
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Client Modal */}
      <Dialog open={showCreateClient} onOpenChange={setShowCreateClient}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Create New Client
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new client to your contacts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name *</label>
                <Input
                  value={clientForm.name}
                  onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Client name"
                  className="w-full"
                />
                {clientErrors.name && (
                  <p className="text-sm text-destructive">{clientErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email *</label>
                <Input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="client@example.com"
                  className="w-full"
                />
                {clientErrors.email && (
                  <p className="text-sm text-destructive">{clientErrors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mobile *</label>
              <Input
                value={clientForm.mobile}
                onChange={(e) => setClientForm(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="+1234567890"
                className="w-full"
              />
              {clientErrors.mobile && (
                <p className="text-sm text-destructive">{clientErrors.mobile}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address Line 1 *</label>
              <Input
                value={clientForm.address1}
                onChange={(e) => setClientForm(prev => ({ ...prev, address1: e.target.value }))}
                placeholder="Street address"
                className="w-full"
              />
              {clientErrors.address1 && (
                <p className="text-sm text-destructive">{clientErrors.address1}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address Line 2</label>
                <Input
                  value={clientForm.address2}
                  onChange={(e) => setClientForm(prev => ({ ...prev, address2: e.target.value }))}
                  placeholder="Apartment, suite, etc."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address Line 3</label>
                <Input
                  value={clientForm.address3}
                  onChange={(e) => setClientForm(prev => ({ ...prev, address3: e.target.value }))}
                  placeholder="City, state, zip"
                  className="w-full"
                />
              </div>
            </div>

            {clientErrors.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{clientErrors.submit}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCreateClient(false)}
              disabled={creatingClient}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateClient}
              disabled={creatingClient}
              className="min-w-[100px]"
            >
              {creatingClient ? "Creating..." : "Create Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateInvoiceModal;
