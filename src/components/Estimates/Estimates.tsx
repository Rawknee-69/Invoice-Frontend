import React, { useState, useEffect } from "react";
import EstimateFilterTabs, { type EstimateStatus } from "./EstimateFilterTabs";
import { estimateApi } from "@/utils/api";

interface EstimateItem {
  id: string;
  estimateNumber: string;
  date: string;
  validUntil: string;
  status: string;
  total: number;
  client: {
    id: string;
    name: string;
    email: string;
  };
}

interface EstimateResponse {
  data: EstimateItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const Estimates = () => {
  const [activeFilter, setActiveFilter] = useState<EstimateStatus>("all");
  const [estimates, setEstimates] = useState<EstimateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState(0);

  // Map our filter types to API status values
  const getApiStatus = (filter: EstimateStatus): string | undefined => {
    switch (filter) {
      case "draft":
        return "DRAFT";
      case "sent":
        return "SENT";
      case "accepted":
        return "ACCEPTED";
      case "declined":
        return "DECLINED";
      case "expired":
        return "EXPIRED";
      default:
        return undefined;
    }
  };

  const fetchEstimates = async (filter: EstimateStatus) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching estimates with filter:", filter);
      
      let response;
      const apiStatus = getApiStatus(filter);

      if (apiStatus) {
        const params = new URLSearchParams({ status: apiStatus });
        console.log("API call with status:", apiStatus, "params:", params.toString());
        response = await estimateApi.getAll(params);
      } else {
        console.log("API call without status filter");
        response = await estimateApi.getAll();
      }

      console.log("API response:", response);

      if (response.error) {
        console.error("API error:", response.error);
        setError(response.error.message);
        return;
      }

      const estimateData = response.data as EstimateResponse;
      console.log("Estimate data:", estimateData);
      const estimates = estimateData.data || [];
      console.log("Extracted estimates:", estimates);
      
      setEstimates(estimates);
      
      // Calculate total value
      const total = estimates.reduce((sum, estimate) => {
        const value = Number(estimate.total) || 0;
        return sum + value;
      }, 0);
      setTotalValue(total);
    } catch (err) {
      setError("Failed to fetch estimates");
      console.error("Estimate fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates(activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filter: EstimateStatus) => {
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
      DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
      SENT: "bg-blue-100 text-blue-800 border-blue-200",
      ACCEPTED: "bg-green-100 text-green-800 border-green-200",
      DECLINED: "bg-red-100 text-red-800 border-red-200",
      EXPIRED: "bg-orange-100 text-orange-800 border-orange-200",
    }[status] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Group estimates by year
  const groupedEstimates = estimates.reduce((groups, estimate) => {
    const year = new Date(estimate.date).getFullYear().toString();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(estimate);
    return groups;
  }, {} as Record<string, EstimateItem[]>);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <EstimateFilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading estimates...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <EstimateFilterTabs
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
        <EstimateFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Total Value Header */}
      {totalValue > 0 && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Estimate Value</span>
            <span className="text-2xl font-semibold text-foreground">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>
      )}

      {/* Estimate Content */}
      {Object.keys(groupedEstimates).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No estimates found</div>
          <div className="text-sm text-muted-foreground">
            {activeFilter === "all" && "You haven't created any estimates yet"}
            {activeFilter === "draft" && "No draft estimates"}
            {activeFilter === "sent" && "No sent estimates"}
            {activeFilter === "accepted" && "No accepted estimates"}
            {activeFilter === "declined" && "No declined estimates"}
            {activeFilter === "expired" && "No expired estimates"}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            All your estimates are auto saved here
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
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Estimate</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Client</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                      Date <span className="text-xs">▼</span>
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Total Value</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedEstimates)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort years descending
                    .map(([year, yearEstimates]) => (
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
                                yearEstimates.reduce((sum, est) => {
                                  const value = Number(est.total) || 0;
                                  return sum + value;
                                }, 0)
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2"></td>
                        </tr>
                        {/* Estimate Rows */}
                        {yearEstimates
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
                          .map((estimate) => (
                            <tr key={estimate.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">
                                    {estimate.estimateNumber}
                                  </span>
                                  {getStatusBadge(estimate.status)}
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <div>
                                  <div className="font-medium text-foreground">{estimate.client.name}</div>
                                  <div className="text-sm text-muted-foreground">{estimate.client.email}</div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">
                                {formatDate(estimate.date)}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <span className="font-semibold text-foreground">
                                  {formatCurrency(Number(estimate.total) || 0)}
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
                All your estimates are auto saved here
              </p>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {Object.entries(groupedEstimates)
              .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort years descending
              .map(([year, yearEstimates]) => (
                <div key={year} className="space-y-2">
                  {/* Year Header */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-lg">{year}</h3>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Total</div>
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(
                            yearEstimates.reduce((sum, est) => {
                              const value = Number(est.total) || 0;
                              return sum + value;
                            }, 0)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimate Cards */}
                  <div className="space-y-2">
                    {yearEstimates
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
                      .map((estimate) => (
                        <div
                          key={estimate.id}
                          className="bg-background rounded-lg border shadow-sm p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">
                                  {estimate.estimateNumber}
                                </h4>
                                {getStatusBadge(estimate.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">{estimate.client.name}</p>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                              <span className="text-lg">⋮</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <div className="text-muted-foreground">
                                {estimate.validUntil ? (
                                  <span>Valid until {formatDate(estimate.validUntil)}</span>
                                ) : (
                                  <span>Created {formatDate(estimate.date)}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-foreground">
                                {formatCurrency(Number(estimate.total) || 0)}
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
                All your estimates are auto saved here
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Estimates;
