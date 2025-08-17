import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import Invoices from "@/components/Invoices/invoices";

const InvoicesPage: React.FC = () => {
  return (
    <div>
      {/* <ModeToggle /> */}
      <Navbar />
      <Invoices />
      <Footer />
    </div>
  );
};

export default InvoicesPage;
