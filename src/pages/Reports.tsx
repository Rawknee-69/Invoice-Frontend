import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import Reports from "@/components/Reports/Reports";

const ReportsPage: React.FC = () => {
  return (
    <div>
      {/* <ModeToggle /> */}
      <Navbar />
      <Reports />
      <Footer />
    </div>
  );
};

export default ReportsPage;
