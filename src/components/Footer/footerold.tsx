"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Search,
  Plus,
  FileText,
  Calculator,
  Receipt,
  BarChart3,
  MoreHorizontal,
  X,
} from "lucide-react";

const estimates = [
  {
    id: "EST0004",
    client: "Simran Rathore",
    amount: 151000.0,
    year: 2025,
  },
  {
    id: "EST0002",
    client: "Simran Rathore",
    amount: 57869.92,
    year: 2025,
  },
];

const totalAmount = estimates.reduce((sum, est) => sum + est.amount, 0);

export function EstimatesPage() {
  const [activeTab, setActiveTab] = useState("Open");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              EstimatesPro
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Invoices</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 text-blue-600 font-medium"
            >
              <Calculator className="w-4 h-4" />
              <span>Estimates</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span>Expenses</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search estimates..." className="pl-10 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Estimate
          </Button>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Status Bar */}
        <div className="bg-blue-600 text-white px-4 py-1 flex items-center justify-between text-sm">
          <span className="font-medium">10:32 X</span>
          <div className="flex items-center space-x-1">
            <span>5G</span>
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white/60 rounded-full"></div>
            </div>
            <span>57%</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Settings className="w-5 h-5" />
            )}
          </Button>
          <h1 className="text-lg font-medium">Estimates</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-700"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white z-50 p-4">
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
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <FileText className="w-5 h-5 text-gray-600" />
                <span>Invoices</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600"
              >
                <Calculator className="w-5 h-5" />
                <span>Estimates</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Receipt className="w-5 h-5 text-gray-600" />
                <span>Expenses</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <span>Reports</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-blue-600 px-4 pb-4">
          <div className="flex space-x-1">
            {["All", "Open", "Closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-blue-600"
                    : "text-white/80 hover:text-white hover:bg-blue-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            {["All", "Open", "Closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Year Summary */}
        <div className="flex items-center justify-between mb-6 md:bg-white md:p-4 md:rounded-lg md:border md:border-gray-200">
          <span className="text-lg font-medium text-gray-600 md:text-xl">
            2025
          </span>
          <span className="text-lg font-semibold text-gray-900 md:text-xl">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Estimates List */}
        <div className="space-y-4">
          {estimates.map((estimate) => (
            <div
              key={estimate.id}
              className="bg-white p-4 rounded-lg border border-gray-200 md:hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {estimate.client}
                  </h3>
                  <p className="text-sm text-gray-500">{estimate.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹
                    {estimate.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <Button
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: FileText, label: "Invoices", active: false },
            { icon: Calculator, label: "Estimates", active: true },
            { icon: Receipt, label: "Expenses", active: false },
            { icon: BarChart3, label: "Reports", active: false },
            { icon: MoreHorizontal, label: "More", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center py-2 px-3 ${item.active ? "text-blue-600" : "text-gray-500"}`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
