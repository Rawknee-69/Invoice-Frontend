import React from "react";
import { ArrowRight } from "lucide-react";

const FlexiblePayments = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <img
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/IS_Homepage-Payments-1024x555-13.png"
              alt="man paying with phone"
              width={1024}
              height={555}
              className="h-auto w-full"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h4 className="mb-4 font-medium text-2xl text-dark-gray md:text-3xl">
              Flexible Ways To Get Paid
            </h4>
            <p className="mb-6 text-base leading-relaxed text-medium-gray">
              With a variety of online payment options, Invoice Simple Payments
              makes it super simple and convenient for your customers to pay
              you. You can easily accept all major credit and debit cards, ACH
              bank transfers (US only), PayPal, and Venmo (US only).
            </p>
            <a
              href="#"
              className="group flex items-center text-sm font-bold uppercase tracking-wider text-primary-orange transition-colors duration-300 hover:text-dark-gray"
            >
              Set Up Invoice Simple Payments Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlexiblePayments;
