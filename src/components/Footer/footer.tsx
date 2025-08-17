import React from "react";
import { Link, useLocation } from "react-router";
import { FileText, Calculator, Receipt, BarChart3 } from "lucide-react";

const Footer: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    { name: "Invoices", icon: FileText, href: "/invoices" },
    { name: "Estimates", icon: Calculator, href: "/estimates" },
    { name: "Expenses", icon: Receipt, href: "/expenses" },
    { name: "Reports", icon: BarChart3, href: "/reports" },
  ];

  // Get current page from location
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/invoices") return "Invoices";
    if (path === "/estimates") return "Estimates";
    if (path === "/expenses") return "Expenses";
    if (path === "/reports") return "Reports";
    return "Invoices"; // default
  };

  const currentPage = getCurrentPage();

  return (
    <>
      {/* Mobile Dock Navigation - Only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-border z-50">
        <div className="flex items-center justify-around py-2 px-4">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                currentPage === item.name
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Add bottom padding to body content on mobile to account for fixed dock */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Footer;
