import { ModeToggle } from "@/components/Themes/modetoggle";
import { Link } from "react-router";
import { buttonVariants } from "../../ui/button";
export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5 px-6">
      <Link to="/" className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Invoice <span className="text-orange-500">Man</span>
        </h1>
      </Link>

      <div className="hidden md:flex items-center gap-5">
        <Link className={buttonVariants({ size: "lg" })} to="/invoices">
          Invoices
        </Link>
        <Link className={buttonVariants({ size: "lg" })} to="/Estimates">
          Estimates
        </Link>
        <Link className={buttonVariants({ size: "lg" })} to="/Expenses">
          Expenses
        </Link>
        <Link className={buttonVariants({ size: "lg" })} to="/Reports">
          Reports
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
