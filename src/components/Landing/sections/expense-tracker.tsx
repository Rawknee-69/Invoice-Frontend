import { ArrowRight } from "lucide-react";

const ExpenseTracker = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-x-16 items-center">
          <div className="text-left">
            <h4 className="text-2xl font-medium text-dark-gray mb-4">
              Business Expense Tracker
            </h4>
            <p className="text-medium-gray text-base leading-6 mb-6">
              Tracking expenses has never been easier. Our business expense and
              receipt tracker lets you scan any receipt, and we capture key info
              automatically. All your expense data is ready to export into a
              summary report whenever you need it.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-primary-orange font-bold text-sm tracking-wider group hover:text-dark-gray transition-colors duration-300"
            >
              USE BUSINESS EXPENSE TRACKER NOW
              <ArrowRight className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          <div>
            <img
              src="https://www.invoicesimple.com/wp-content/uploads/2023/08/expense-hp-image-1024x532.jpg"
              alt="Hands holding a receipt and a mobile device for expense tracking"
              width={1024}
              height={532}
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpenseTracker;
