import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navigation/Navbar/navbar";
import { GenericSkeleton } from "@/skletons";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for demo
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4 sm:p-6">
          <GenericSkeleton type="card" count={3} showHeader />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome to Invoice Manager</h1>
          <p className="text-muted-foreground">
            Manage your invoices, expenses, and estimates with ease
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
