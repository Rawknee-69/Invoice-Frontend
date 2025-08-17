import { useState } from "react";
import InvoiceFilterTabs, { type InvoiceStatus } from "./InvoiceFilterTabs";

const Invoices = () => {
  const [activeFilter, setActiveFilter] = useState<InvoiceStatus>("all");

  const handleFilterChange = (filter: InvoiceStatus) => {
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
        <InvoiceFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Invoice content will be rendered here based on activeFilter */}
      <div className="text-muted-foreground">
        {activeFilter === "all" && "Showing all invoices"}
        {activeFilter === "outstanding" && "Showing outstanding invoices"}
        {activeFilter === "paid" && "Showing paid invoices"}
      </div>
    </div>
  );
};

export default Invoices;
