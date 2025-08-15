import { ArrowRight } from "lucide-react";

const OnlineGenerator = () => {
  return (
    <section className="bg-white py-20 px-5">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="flex justify-center">
            <img
              src="https://www.invoicesimple.com/wp-content/uploads/2024/02/online-invoice-generator-image.jpeg"
              alt="A person in red work gloves uses a smartphone, demonstrating the ease of the online invoice generator."
              width={1024}
              height={1024}
              className="w-full h-auto max-w-md rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-medium text-dark-gray mb-4">
              Online Invoice Generator
            </h3>
            <p className="text-base text-medium-gray mb-6">
              Use our invoice generator to manage your invoicing from any
              device, anytime. Your account is always connected and your data is
              saved securely for you.
            </p>
            <a
              href="https://www.invoicesimple.com/online-invoice-generator"
              className="text-primary-orange font-bold text-sm uppercase tracking-wider flex items-center group"
            >
              Use invoice generator now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineGenerator;
