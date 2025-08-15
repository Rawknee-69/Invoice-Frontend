const FinalCtaSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#FF7E52] to-[#FF5722] py-20">
      {/* Decorative background circles */}
      <div
        className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="absolute top-8 -right-24 h-48 w-48 rounded-full bg-white/10"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto flex flex-col items-center px-5 text-center">
        <h2 className="text-[36px] font-bold leading-tight text-white">
          Get Started for Free
        </h2>
        <p className="mt-4 text-lg font-normal text-white">
          Send your first invoice right now (it's free!)
        </p>
        <a
          href="https://www.invoicesimple.com/online-invoice-generator"
          className="mt-8 inline-flex items-center rounded-md bg-white px-8 py-4 text-base font-medium uppercase tracking-wider text-primary-orange shadow-md transition hover:bg-light-gray"
        >
          Get Started <span className="ml-2 font-bold">›</span>
        </a>
      </div>
    </section>
  );
};

export default FinalCtaSection;
