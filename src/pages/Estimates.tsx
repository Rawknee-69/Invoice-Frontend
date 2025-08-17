import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Estimates from "@/components/Estimates/Estimates";

const InvoicesPage: React.FC = () => {
  return (
    <div>
      {/* <ModeToggle /> */}
      <Navbar />
      <Estimates />
    </div>
  );
};

export default InvoicesPage;
