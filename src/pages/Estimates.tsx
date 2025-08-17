import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import Estimates from "@/components/Estimates/Estimates";

const EstimatesPage: React.FC = () => {
  return (
    <div>
      {/* <ModeToggle /> */}
      <Navbar />
      <Estimates />
      <Footer />
    </div>
  );
};

export default EstimatesPage;
