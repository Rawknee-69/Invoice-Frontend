import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import Invoice from "/src/assets/invoice.png";

const navLinks = [
  // { href: "#", label: "Online Invoice Generator" },
  { href: "#", label: "Features", hasDropdown: true },
  { href: "#", label: "Pricing", hasDropdown: true },
  { href: "#", label: "Templates", hasDropdown: true },
  { href: "#", label: "Tools", hasDropdown: true },
  { href: "#", label: "About", hasDropdown: true },
];

const NavigationLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white w-full border-b border-gray-200 z-50 shadow-sm sticky top-0">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 h-[88px] flex items-center justify-between">
        <Link to="/" className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={Invoice}
              alt="Invoice Man"
              width={50}
              height={40}
              className="w-10 h-10 lg:w-12 lg:h-12"
            />
            <div className="text-2xl lg:text-3xl font-bold leading-[1.2] text-[#000000]">
              Invoice Man
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-x-6 xl:gap-x-8">
          <nav className="flex items-center gap-x-6 xl:gap-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-primary-orange transition-colors text-sm xl:text-base font-medium flex items-center gap-1 whitespace-nowrap"
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown size={18} strokeWidth={1.5} className="ml-1" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center ml-4 xl:ml-6 gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/home"
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-gray-200 text-gray-700 font-medium rounded-[4px] px-4 py-2 xl:px-5 xl:py-2.5 text-xs xl:text-sm hover:bg-gray-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="bg-primary-orange text-white font-bold rounded-[4px] px-5 py-2.5 xl:px-6 xl:py-3 uppercase text-xs xl:text-sm tracking-wide hover:bg-opacity-90 transition-colors whitespace-nowrap"
                >
                  TRY IT FREE
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-2"
            aria-label="Toggle menu"
          >
            <span className="text-dark-gray font-medium text-base">More</span>
            <div className="flex flex-col justify-center items-center h-6 w-6">
              <span
                className={`block h-0.5 w-5 bg-dark-gray transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`}
              ></span>
              <span
                className={`block h-0.5 w-5 bg-dark-gray my-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`block h-0.5 w-5 bg-dark-gray transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              ></span>
            </div>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col px-5 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-3 border-b text-dark-gray font-medium flex justify-between items-center"
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown size={20} strokeWidth={1.5} />
                )}
              </a>
            ))}
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to="/home"
                  className="bg-blue-600 text-white text-center font-medium rounded-[4px] px-6 py-3 text-sm hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-gray-200 text-gray-700 text-center font-medium rounded-[4px] px-6 py-3 text-sm hover:bg-gray-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to="/login"
                  className="bg-gray-200 text-gray-700 text-center font-medium rounded-[4px] px-6 py-3 text-sm hover:bg-gray-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="bg-primary-orange text-white text-center font-bold rounded-[4px] px-6 py-3 uppercase text-sm tracking-wide hover:bg-opacity-90 transition-colors"
                >
                  TRY IT FREE
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationLanding;
