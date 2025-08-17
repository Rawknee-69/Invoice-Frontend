import React from "react";
import { cn } from "@/lib/utils";

export type InvoiceStatus = "all" | "outstanding" | "paid";

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
    { key: "outstanding", label: "Outstanding" },
    { key: "paid", label: "Paid" },
  ];

  return (
    <div className={cn("inline-flex rounded-lg bg-muted/30 p-1", className)}>
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
  );
};

export default InvoiceFilterTabs;
