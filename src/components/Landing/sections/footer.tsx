import { Link } from "react-router";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type LinkItem = {
  name: string;
  href: string;
  icon?: boolean;
};

const productLinks: LinkItem[] = [
  { name: "Online Invoice Generator", href: "#" },
  { name: "Receipt Maker", href: "#" },
  { name: "Estimate Maker", href: "#" },
  { name: "Features", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Login", href: "#", icon: true },
];

const resourcesLinks: LinkItem[] = [
  { name: "Invoice Templates", href: "#" },
  { name: "Receipt Template", href: "#" },
  { name: "Profit Margin Calculator", href: "#" },
  { name: "Our Blog", href: "#" },
  { name: "Support", href: "#", icon: true },
];

const companyLinks: LinkItem[] = [
  { name: "About", href: "#" },
  { name: "Customers", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Contact", href: "#" },
];

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/invoicesimple/",
    name: "Facebook",
  },
  {
    icon: FaLinkedinIn,
    href: "https://ca.linkedin.com/company/invoice-simple",
    name: "LinkedIn",
  },
  {
    icon: FaTwitter,
    href: "https://twitter.com/invoicesimple",
    name: "Twitter",
  },
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/channel/UC39zU_aXp273aF3aV_c435w",
    name: "YouTube",
  },
];

const LinkColumn = ({ title, links }: { title: string; links: LinkItem[] }) => (
  <div>
    <h3 className="font-bold text-base text-[#4a4a4a] mb-5">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            className="text-sm text-[#6b6b6b] hover:text-[#ff5722] transition-colors flex items-center"
          >
            {link.name}
            {link.icon && <ArrowUpRight className="w-3 h-3 ml-1" />}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f5] pt-20 pb-10 font-sans">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-8 mb-16">
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/logo2x-1.png"
                alt="Invoice Simple"
                width={200}
                height={46}
                className="w-[150px] h-auto"
              />
            </Link>
            <p className="text-sm text-[#6b6b6b] mt-4">
              Invoice your customers in seconds.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-gray-500 hover:text-[#ff5722] transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="Product" links={productLinks} />
          <LinkColumn title="Resources" links={resourcesLinks} />
          <LinkColumn title="Company" links={companyLinks} />

          <div>
            <h3 className="font-bold text-base text-[#4a4a4a] mb-5">
              Get Started
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center justify-center w-full bg-[#ff5722] text-white py-2.5 px-4 rounded-md text-sm font-bold hover:bg-[#e64a19] transition-colors"
              >
                TRY IT FREE
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a href="#">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/appstore-scaled-17.png"
                  alt="Download on the App Store"
                  width={170}
                  height={50}
                  className="w-full max-w-[170px] h-auto"
                />
              </a>
              <a href="#">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03298abd-8dd0-4070-a08b-cd8d4b187139-invoicesimple-com/assets/images/googleplay-scaled-18.png"
                  alt="Get it on Google Play"
                  width={170}
                  height={50}
                  className="w-full max-w-[170px] h-auto"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-[#ababab]">
          <p>© 2025 Invoice Simple.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#ff5722] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#ff5722] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
