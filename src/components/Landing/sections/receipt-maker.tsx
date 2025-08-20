import { ArrowRight } from "lucide-react";

const ReceiptMakerSection = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image Column */}
          <div className="relative w-full aspect-[1024/662]">
            <img
              src="https://www.invoicesimple.com/wp-content/uploads/2023/01/make-receipts.jpg"
              alt="man creating receipt on laptop"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>

          {/* Text Column */}
          <div className="text-left">
            <h3 className="text-[36px] leading-[1.3] font-medium text-dark-gray mb-4">
              Online Receipt Maker
            </h3>
            <p className="text-medium-gray text-base leading-[1.5] mb-6">
              Once you've received payment, use our receipt maker to create a
              receipt and send it to clients. Re-use all the details from your
              invoice or quote to have the receipt ready in seconds.
            </p>
            <a
              href="https://www.invoicesimple.com/receipt-template/receipt-maker"
              className="text-primary-orange font-bold text-sm tracking-wider flex items-center group hover:text-dark-gray transition-colors duration-300"
            >
              USE RECEIPT MAKER NOW
              <ArrowRight className="ml-[6px] h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReceiptMakerSection;
