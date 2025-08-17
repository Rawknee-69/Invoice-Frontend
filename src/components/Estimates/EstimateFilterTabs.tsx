import React from "react";
import { cn } from "@/lib/utils";

export type EstimatesStatus = "all" | "open" | "closed";

interface EstimatesFilterTabsProps {
  activeFilter: EstimatesStatus;
  onFilterChange: (filter: EstimatesStatus) => void;
  className?: string;
}

const EstimatesFilterTabs: React.FC<EstimatesFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  className,
}) => {
  const filters: { key: EstimatesStatus; label: string }[] = [
    { key: "all", label: "All Estimates" },
    { key: "open", label: "Open" },
    { key: "closed", label: "Closed" },
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

export default EstimatesFilterTabs;
