"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Search,
  // Plus,
  FileText,
  Calculator,
  Receipt,
  BarChart3,
  X,
} from "lucide-react";

interface NavbarProps {
  currentPage?: string;
  searchPlaceholder?: string;
  showNewButton?: boolean;
  newButtonText?: string;
  onNewClick?: () => void;
}

export function Navbar({
  currentPage = "Estimates",
  searchPlaceholder = "Search...",
  // showNewButton = true,
  // newButtonText = "New Item",
  // onNewClick,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Invoices", icon: FileText, href: "#" },
    { name: "Estimates", icon: Calculator, href: "#" },
    { name: "Expenses", icon: Receipt, href: "#" },
    { name: "Reports", icon: BarChart3, href: "#" },
  ];

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
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 transition-colors ${
                  currentPage === item.name
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder={searchPlaceholder} className="pl-10 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
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

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/80"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Settings className="w-5 h-5" />
            )}
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

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-background z-50 p-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    currentPage === item.name
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
