import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import Expenses from "@/components/Expenses/Expenses";

const ExpensesPage: React.FC = () => {
  return (
    <div>
      {/* <ModeToggle /> */}
      <Navbar />
      <Expenses />
      <Footer />
    </div>
  );
};

export default ExpensesPage;
