import { ArrowRight } from "lucide-react";

const MobileShowcase = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[35px] font-medium text-dark-gray leading-[1.3] mb-7">
            Invoice Simple On The Go
          </h2>

          <div className="flex justify-center items-center flex-wrap gap-2 mb-7">
            <a href="https://is.onelink.me/Aj46?af_js_web=true&af_ss_ver=2_9_0&pid=website&c=spz_1007_control&af_channel=organic&af_ad=app_button_click&af_adset=blank&af_cro=control&af_campaignID=blank&af_adgroupID=blank&af_matchtype=blank&af_network=blank&af_creative=blank&af_targetID=blank&af_ss_ui=true">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/Apple-Store-icon-2.png"
                alt="Download on the App Store"
                width={168}
                height={50}
                className="h-[50px] w-auto"
              />
            </a>
            <a href="https://is.onelink.me/Aj46?af_js_web=true&af_ss_ver=2_9_0&pid=website&c=spz_1007_control&af_channel=organic&af_ad=app_button_click&af_adset=blank&af_cro=control&af_campaignID=blank&af_adgroupID=blank&af_matchtype=blank&af_network=blank&af_creative=blank&af_targetID=blank&af_ss_ui=true&af_web_dp=https://play.google.com/store/apps/details?id=com.aadhk.woinvoice&hl=en_US">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/Icon-Google-play-3.png"
                alt="Get it on Google Play"
                width={169}
                height={50}
                className="h-[50px] w-auto"
              />
            </a>
          </div>

          <p className="text-[22px] font-normal text-medium-gray leading-[1.4] mb-8">
            Take your invoices anywhere with the Invoice Simple Mobile App
          </p>

          <div className="relative max-w-[854px] mx-auto group mb-12">
            <a href="https://youtu.be/sNJyvwA9rMM" className="block relative">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/maxresdefault-14.jpg"
                alt="Invoice Simple - The Easiest Invoicing App You'll Ever Use"
                width={854}
                height={480}
                className="w-full h-auto rounded-[5px] shadow-[0_5px_15px_0_rgba(0,0,0,0.15)]"
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/videoplayscaled-15.png"
                  alt="Play Video"
                  width={125}
                  height={125}
                  className="w-[125px] h-auto transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
            </a>
          </div>

          <a
            href="https://www.invoicesimple.com/features-invoicing-billing-tools"
            className="inline-flex items-center justify-center bg-green text-white text-base font-medium py-4 px-8 rounded-[5px] shadow-md hover:opacity-90 transition-opacity uppercase"
          >
            Explore App Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
