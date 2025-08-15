import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold leading-[1.2] text-[#4A4A4A]">
              Invoice Your Customers
              <br />
              in Seconds
            </h1>
            <p className="mt-6 text-lg text-[#6B6B6B]">
              The world's simplest way to invoice customers, from your phone or
              laptop. Save time, stay organized and look professional.
            </p>
            <p className="mt-4 text-base text-[#6B6B6B]">
              For contractors, freelancers, owner-operators, creatives, and
              other small business owners.
            </p>

            <a
              href="https://www.invoicesimple.com/invoice-generator"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5722] px-8 py-4 text-base font-medium text-white shadow-md transition-colors hover:bg-[#E64A19]"
            >
              CREATE AN INVOICE NOW
              <ArrowRight size={20} />
            </a>

            <p className="mt-8 text-sm text-[#6B6B6B]">
              Download the app today & try it for free!
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/hero-homepage-1-1-1200x1034-4.jpg"
              alt="Invoice Simple app shown on a laptop and a mobile phone"
              width={1200}
              height={1034}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
