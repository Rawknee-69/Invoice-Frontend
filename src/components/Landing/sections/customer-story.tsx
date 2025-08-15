import { ArrowRight } from "lucide-react";

const CustomerStory = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div className="text-left">
            <h3 className="mb-2 font-medium text-[24px] leading-tight text-[#4a4a4a]">
              Meet Jesse
            </h3>
            <h4 className="mb-6 text-[16px] font-bold leading-normal text-[#4a4a4a]">
              Co-Founder &amp; Photographer at TO2Rio
            </h4>
            <p className="mb-8 text-[16px] leading-6 text-[#6b6b6b]">
              Jesse runs a multinational photography company out of Toronto.
              With a team of 12 working across the continent, invoicing on time
              used to be a challenge. The whole team now gets their invoicing
              done on location as soon as they've finished an event. Their
              clients love it and Jesse has immediate visibility into what's
              been delivered.
            </p>
            <a
              href="https://www.invoicesimple.com/our-customers/jesse-george"
              className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-wider text-primary-orange transition-colors duration-300 ease-in-out hover:text-dark-gray"
            >
              Read Jesse's Story
              <ArrowRight size={16} className="h-4 w-4" />
            </a>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src="https://www.invoicesimple.com/wp-content/uploads/2023/01/Jesse-George-Image-1.jpg"
              alt="Jesse George working in his creative space"
              width={1000}
              height={1000}
              className="h-auto w-full max-w-md md:max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerStory;
