import { ArrowRight } from "lucide-react";

const EstimateTemplates = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="text-left">
            <h3 className="mb-4 text-2xl font-medium text-dark-gray md:text-3xl">
              Easy to use Estimate Templates
            </h3>
            <p className="mb-6 leading-relaxed text-medium-gray">
              Send estimates immediately to secure new jobs. Convert those
              estimates to invoices with a touch of a button.
            </p>
            <a
              href="#"
              className="group flex items-center text-sm font-medium uppercase tracking-wider text-primary-orange transition-colors duration-300 hover:text-dark-gray"
            >
              View estimate templates now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src="https://www.invoicesimple.com/wp-content/uploads/2023/01/MicrosoftTeams-image-4-1.jpg"
              alt="A smiling mechanic browses estimate templates on a laptop in his auto shop."
              width={540}
              height={360}
              className="rounded-lg object-cover shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstimateTemplates;
