import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";

const navLinks = [
  { href: "#", label: "Online Invoice Generator" },
  { href: "#", label: "Features", hasDropdown: true },
  { href: "#", label: "Pricing", hasDropdown: true },
  { href: "#", label: "Templates", hasDropdown: true },
  { href: "#", label: "Tools", hasDropdown: true },
  { href: "#", label: "About", hasDropdown: true },
];

const NavigationLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white w-full border-b border-gray-200 z-50 shadow-sm sticky top-0">
      <div className="max-w-[1200px] mx-auto px-5 h-[88px] flex items-center justify-between">
        <Link to="/">
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/logo2x-1.png"
            alt="Invoice Simple"
            width={200}
            height={46}
            className="w-[150px] h-auto lg:w-[200px]"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-dark-gray hover:text-primary-orange transition-colors text-base font-medium flex items-center gap-1"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown size={20} strokeWidth={1.5} />}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <a
            href="#"
            className="bg-primary-orange text-white font-bold rounded-[4px] px-6 py-3 uppercase text-sm tracking-wide hover:bg-opacity-90 transition-colors"
          >
            TRY IT FREE
          </a>
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
            <a
              href="#"
              className="bg-primary-orange text-white text-center font-bold rounded-[4px] mt-4 px-6 py-3 uppercase text-sm tracking-wide hover:bg-opacity-90 transition-colors"
            >
              TRY IT FREE
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationLanding;
