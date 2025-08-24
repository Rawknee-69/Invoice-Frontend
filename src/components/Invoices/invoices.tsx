import React, { useState, useEffect } from "react";
import InvoiceFilterTabs, { type InvoiceStatus } from "./InvoiceFilterTabs";
import { invoiceApi } from "@/utils/api";
import { InvoiceSkeleton } from "@/skletons";

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: string;
  total: number;
  amountPaid: number;
  balanceDue: number;
  client: {
    id: string;
    name: string;
    email: string;
  };
}

interface InvoiceResponse {
  data: InvoiceItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const Invoices = () => {
  const [activeFilter, setActiveFilter] = useState<InvoiceStatus>("all");
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);

  // Map our filter types to API status values
  const getApiStatus = (filter: InvoiceStatus): string | undefined => {
    switch (filter) {
      case "paid":
        return "PAID";
      case "overdue":
        return "OVERDUE";
      case "draft":
        return "DRAFT";
      default:
        return undefined;
    }
  };

  const fetchInvoices = async (filter: InvoiceStatus) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      const apiStatus = getApiStatus(filter);

      if (filter === "overdue") {
        response = await invoiceApi.getOverdue();
      } else if (apiStatus) {
        const params = new URLSearchParams({ status: apiStatus });
        response = await invoiceApi.getByStatus(apiStatus, params);
      } else {
        response = await invoiceApi.getAll();
      }

      if (response.error) {
        setError(response.error.message);
        return;
      }

      let invoiceData: InvoiceItem[];
      
      // Handle different response formats
      if (filter === "overdue") {
        // These endpoints return arrays directly
        invoiceData = response.data as InvoiceItem[];
      } else {
        // Other endpoints return paginated responses
        const paginatedData = response.data as InvoiceResponse;
        invoiceData = paginatedData.data || [];
      }
      
      setInvoices(invoiceData);
      
      // Debug: Log first invoice to understand data structure
      if (invoiceData.length > 0) {
        console.log("Sample invoice data:", invoiceData[0]);
        console.log("Balance due type:", typeof invoiceData[0].balanceDue);
        console.log("Balance due value:", invoiceData[0].balanceDue);
      }
      
      // Calculate total balance due with proper number conversion
      const total = invoiceData.reduce((sum, invoice) => {
        const balance = Number(invoice.balanceDue) || 0;
        console.log(`Invoice ${invoice.invoiceNumber}: balance = ${balance}`);
        return sum + balance;
      }, 0);
      console.log("Final total:", total);
      setTotalBalance(total);
    } catch (err) {
      setError("Failed to fetch invoices");
      console.error("Invoice fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filter: InvoiceStatus) => {
    setActiveFilter(filter);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClass = {
      PAID: "bg-green-100 text-green-800 border-green-200",
      SENT: "bg-blue-100 text-blue-800 border-blue-200",
      DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
      OVERDUE: "bg-red-100 text-red-800 border-red-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    }[status] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Group invoices by year
  const groupedInvoices = invoices.reduce((groups, invoice) => {
    const year = new Date(invoice.date).getFullYear().toString();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(invoice);
    return groups;
  }, {} as Record<string, InvoiceItem[]>);

  if (loading) {
    return <InvoiceSkeleton count={8} />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <InvoiceFilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <InvoiceFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Total Balance Header */}
      {totalBalance > 0 && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Balance Due</span>
            <span className="text-2xl font-semibold text-foreground">
              {formatCurrency(totalBalance)}
            </span>
          </div>
        </div>
      )}

      {/* Invoice Content */}
      {Object.keys(groupedInvoices).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No invoices found</div>
          <div className="text-sm text-muted-foreground">
            {activeFilter === "all" && "You haven't created any invoices yet"}
            {activeFilter === "paid" && "No paid invoices"}
            {activeFilter === "overdue" && "No overdue invoices"}
            {activeFilter === "draft" && "No draft invoices"}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            All your invoices are auto saved here
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-background rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Invoice</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Client</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                      Date <span className="text-xs">▼</span>
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Balance Due</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedInvoices)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort years descending
                    .map(([year, yearInvoices]) => (
                      <React.Fragment key={year}>
                        {/* Year Header Row */}
                        <tr className="border-b bg-muted/20">
                          <td colSpan={3} className="px-4 py-2 font-semibold text-foreground">
                            {year}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <div className="text-xs text-muted-foreground">Total</div>
                            <div className="text-sm font-medium text-foreground">
                              {formatCurrency(
                                yearInvoices.reduce((sum, inv) => {
                                  const balance = Number(inv.balanceDue) || 0;
                                  return sum + balance;
                                }, 0)
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2"></td>
                        </tr>
                        {/* Invoice Rows */}
                        {yearInvoices
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
                          .map((invoice) => (
                                                      <tr key={invoice.id} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  {invoice.invoiceNumber}
                                </span>
                                {getStatusBadge(invoice.status)}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div>
                                <div className="font-medium text-foreground">{invoice.client.name}</div>
                                <div className="text-sm text-muted-foreground">{invoice.client.email}</div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-muted-foreground">
                              {formatDate(invoice.date)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <span className="font-semibold text-foreground">
                                {formatCurrency(Number(invoice.balanceDue) || 0)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <span className="text-lg">⋮</span>
                              </button>
                            </td>
                          </tr>
                          ))}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
            
            {/* Desktop Footer Message */}
            <div className="p-4 text-center border-t bg-muted/20">
              <p className="text-xs text-muted-foreground">
                All your invoices are auto saved here
              </p>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {Object.entries(groupedInvoices)
              .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort years descending
              .map(([year, yearInvoices]) => (
                <div key={year} className="space-y-2">
                  {/* Year Header */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-lg">{year}</h3>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Total</div>
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(
                            yearInvoices.reduce((sum, inv) => {
                              const balance = Number(inv.balanceDue) || 0;
                              return sum + balance;
                            }, 0)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Cards */}
                  <div className="space-y-2">
                    {yearInvoices
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
                      .map((invoice) => (
                        <div
                          key={invoice.id}
                          className="bg-background rounded-lg border shadow-sm p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">
                                  {invoice.invoiceNumber}
                                </h4>
                                {getStatusBadge(invoice.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                              <span className="text-lg">⋮</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <div className="text-muted-foreground">
                                {invoice.status === "OVERDUE" ? (
                                  <span className="text-red-600 font-medium">
                                    Due {formatDate(invoice.dueDate)}
                                  </span>
                                ) : (
                                  <span>Due {formatDate(invoice.dueDate)}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-foreground">
                                {formatCurrency(Number(invoice.balanceDue) || 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            
            {/* Mobile Footer Message */}
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">
                All your invoices are auto saved here
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Invoices;
