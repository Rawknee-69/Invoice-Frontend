import { useState } from "react";
import EstimatesFilterTabs, {
  type EstimatesStatus,
} from "./EstimatefilterTabs";

const Invoices = () => {
  const [activeFilter, setActiveFilter] = useState<EstimatesStatus>("all");

  const handleFilterChange = (filter: EstimatesStatus) => {
    setActiveFilter(filter);
    // TODO: Implement filtering logic based on selected filter
    console.log("Filter changed to:", filter);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        {/* <h1 className="text-2xl font-semibold text-foreground">Invoices</h1> */}
      </div>

      <div className="mb-6">
        <EstimatesFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Invoice content will be rendered here based on activeFilter */}
      <div className="text-muted-foreground">
        {activeFilter === "all" && "Showing all Estimates"}
        {activeFilter === "open" && "Showing open Estimates"}
        {activeFilter === "closed" && "Showing closed Estimates"}
      </div>
    </div>
  );
};

export default Invoices;
