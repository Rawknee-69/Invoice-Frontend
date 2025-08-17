import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Expenses from "@/components/Expenses/Expenses";

const InvoicesPage: React.FC = () => {
  return (
    <div>
      {/* <ModeToggle /> */}
      <Navbar />
      <Expenses />
    </div>
  );
};

export default InvoicesPage;
