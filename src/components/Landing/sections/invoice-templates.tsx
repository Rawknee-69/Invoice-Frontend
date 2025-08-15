import React from "react";
import { ArrowRight } from "lucide-react";

const InvoiceTemplatesSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 items-center">
          <div className="text-left">
            <h4 className="text-2xl font-medium text-dark-gray mb-4">
              Professional Invoice Templates
            </h4>
            <p className="text-medium-gray text-base leading-relaxed mb-8">
              Looking to send an invoice right now? Use our online invoice
              generator or one of our downloadable, printable and fully
              customizable invoice templates!
            </p>
            <a
              href="/invoice-template"
              className="group inline-flex items-center gap-2 text-primary-orange font-bold text-sm tracking-wider hover:text-dark-gray transition-colors"
            >
              INVOICE TEMPLATE COLLECTION
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/professional-invoice-template-8.jpg"
              alt="A woman with short hair and glasses smiling while working on a laptop in a workshop setting."
              width={570}
              height={380}
              className="rounded-lg object-cover w-full h-auto max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceTemplatesSection;
