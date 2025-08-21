import React from "react";
import { cn } from "@/lib/utils";

export type InvoiceStatus = "all" | "paid" | "overdue" | "draft";

interface InvoiceFilterTabsProps {
  activeFilter: InvoiceStatus;
  onFilterChange: (filter: InvoiceStatus) => void;
  className?: string;
}

const InvoiceFilterTabs: React.FC<InvoiceFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  className,
}) => {
  const filters: { key: InvoiceStatus; label: string }[] = [
    { key: "all", label: "All invoices" },
    { key: "paid", label: "Paid" },
    { key: "overdue", label: "Overdue" },
    { key: "draft", label: "Draft" },
  ];

  return (
    <div className={cn("w-full md:w-auto", className)}>
      {/* Mobile: Horizontal scrollable tabs */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 p-1 min-w-max">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={cn(
                "relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                activeFilter === filter.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Standard inline-flex */}
      <div className="hidden md:inline-flex rounded-lg bg-muted/30 p-1">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              activeFilter === filter.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/50"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvoiceFilterTabs;
