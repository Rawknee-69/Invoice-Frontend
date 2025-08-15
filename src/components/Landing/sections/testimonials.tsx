import { ArrowRight, Star } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section>
      <div className="bg-[#5865F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 py-8">
            <h3 className="text-white text-xl md:text-2xl font-medium text-center md:text-left">
              Meet more small business owners using Invoice Simple
            </h3>
            <a
              href="https://www.invoicesimple.com/customers"
              className="inline-flex items-center justify-center px-8 py-3 border border-white rounded-md text-base font-medium text-white hover:bg-white hover:text-[#5865F2] transition-colors whitespace-nowrap"
            >
              OUR CUSTOMERS
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-shrink-0">
              <div className="relative w-36 h-36 bg-[#4A4A4A] rounded-full flex items-center justify-center">
                <span className="text-white text-8xl font-serif transform -translate-y-2 select-none">
                  “
                </span>
              </div>
            </div>

            <div className="flex-grow text-center lg:text-left">
              <blockquote className="text-xl md:text-2xl text-medium-gray italic leading-relaxed">
                <p>
                  This is so simple and straightforward. It completely removes
                  the need for me to go into excel. A brilliant little tool that
                  not only helps me generate invoices, but emails them directly
                  and tracks when they are opened too!
                </p>
              </blockquote>
              <div className="mt-8 flex justify-center lg:justify-start">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              <footer className="mt-6">
                <p className="text-lg font-medium text-dark-gray">
                  - Darren Starr
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
