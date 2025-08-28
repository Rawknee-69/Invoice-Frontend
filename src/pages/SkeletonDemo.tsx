import React from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import SkeletonDemo from "@/skletons/SkeletonDemo";

const SkeletonDemoPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <SkeletonDemo />
      <Footer />
    </div>
  );
};

export default SkeletonDemoPage;




