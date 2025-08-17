import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Invoices from "@/components/Invoices/invoices";

const InvoicesPage: React.FC = () => {
  return (
    <div>
      {/* <ModeToggle /> */}
      <Navbar />
      <Invoices />
    </div>
  );
};

export default InvoicesPage;
