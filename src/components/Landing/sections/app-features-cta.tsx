import { ArrowRight } from "lucide-react";

const AppFeaturesCta = () => {
  return (
    // This parent div creates the skew effect for the diagonal background.
    // The margin provides spacing from adjacent sections.
    <div className="transform -skew-y-2 my-20 md:my-24">
      <section className="bg-gradient-to-r from-[#388e3c] to-[#4caf50]">
        {/* This inner div counteracts the skew, ensuring the content is not distorted. */}
        <div className="transform skew-y-2">
          <div className="relative max-w-4xl mx-auto px-6 py-20 sm:py-24 text-center overflow-hidden">
            {/* Decorative semi-transparent circles positioned in the background. */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full pointer-events-none"></div>

            {/* A relative wrapper with z-index to ensure content appears above the decorative circles. */}
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl text-white font-medium max-w-3xl mx-auto leading-tight">
                See Why 500,000+ Small Business Owners Love Invoice Simple's App
              </h2>

              <a
                href="https://www.invoicesimple.com/features-old"
                className="mt-8 inline-flex items-center justify-center bg-white text-[#4CAF50] font-bold text-sm tracking-widest uppercase py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-md"
              >
                Explore App Features
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppFeaturesCta;
