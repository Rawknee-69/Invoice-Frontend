import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Reports from "@/components/Reports/Reports";

const InvoicesPage: React.FC = () => {
  return (
    <div>
      {/* <ModeToggle /> */}
      <Navbar />
      <Reports />
    </div>
  );
};

export default InvoicesPage;
