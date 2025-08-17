"use client";

import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  // Settings,
  Search,
  // Plus,
  FileText,
  Calculator,
  Receipt,
  BarChart3,
} from "lucide-react";

import { ModeToggle } from "@/components/Themes/modetoggle";

interface NavbarProps {
  searchPlaceholder?: string;
  showNewButton?: boolean;
  newButtonText?: string;
  onNewClick?: () => void;
}

export function Navbar({
  searchPlaceholder = "Search...",
  // showNewButton = true,
  // newButtonText = "New Item",
  // onNewClick,
}: NavbarProps) {
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
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-background border-b border-border">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Invoice <span className="text-orange-500">Man</span>
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 transition-colors ${
                  currentPage === item.name
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder={searchPlaceholder} className="pl-10 w-64" />
          </div>
          {/* <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button> */}
          <ModeToggle />
          {/* {showNewButton && (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={onNewClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              {newButtonText}
            </Button>
          )} */}
        </div>
      </nav>

      {/* Mobile Header - Simplified since navigation is now in footer dock */}
      <div className="md:hidden">
        <div className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/80"
          >
            {/* <Settings className="w-5 h-5" /> */}
          </Button>
          <h1 className="text-lg font-medium">{currentPage}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/80"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
