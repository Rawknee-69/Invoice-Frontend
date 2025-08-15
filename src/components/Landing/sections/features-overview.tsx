const features = [
  {
    iconSrc:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/icons/Save-Time-60x60-3.png",
    title: "Save Time",
    description:
      "Quickly create professional invoices and estimates wherever you are—with a customer, between jobs, or at home. Convert estimates to invoices with one click.",
    alt: "Save Time icon",
  },
  {
    iconSrc:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/Get-Paid-60x60-6.png",
    title: "Get Paid",
    description:
      "Email, text or print your invoices. Get notified when invoices are read and stay on top of late payments. Accept credit card payments as well as cash, check and others.",
    alt: "Get Paid icon",
  },
  {
    iconSrc:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/Look-Professional-60x60-7.png",
    title: "Look Professional",
    description:
      "Simply choose an invoice template and customize it with your logo. Add a signature, photos, notes and more. Always look professional and stay organized.",
    alt: "Look Professional icon",
  },
];

const FeaturesOverview = () => {
  return (
    <section className="bg-light-gray py-20">
      <div className="container mx-auto max-w-[1200px] px-5 text-center">
        <h2 className="text-[36px] font-medium leading-[1.3] text-dark-gray mb-16">
          The Easiest Invoicing Software You’ll Ever Use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-orange">
                <img
                  src={feature.iconSrc}
                  alt={feature.alt}
                  width={60}
                  height={60}
                />
              </div>
              <h3 className="mb-4 text-[24px] font-medium leading-[1.4] text-dark-gray">
                {feature.title}
              </h3>
              <p className="max-w-sm text-base leading-[1.5] text-medium-gray">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;
