import Navigation from "../components/Landing/sections/navbar-Landing";
import HeroSection from "../components/Landing/sections/hero";
import FeaturesOverview from "../components/Landing/sections/features-overview";
import InvoiceTemplatesSection from "../components/Landing/sections/invoice-templates";
import OnlineGenerator from "../components/Landing/sections/online-generator";
import EstimateTemplates from "../components/Landing/sections/estimate-templates";
import ReceiptMakerSection from "../components/Landing/sections/receipt-maker";
import ExpenseTracker from "../components/Landing/sections/expense-tracker";
import FlexiblePayments from "../components/Landing/sections/flexible-payments";
import AppFeaturesCta from "../components/Landing/sections/app-features-cta";
import MobileShowcase from "../components/Landing/sections/mobile-showcase";
import CustomerStory from "../components/Landing/sections/customer-story";
import TestimonialSection from "../components/Landing/sections/testimonials";
import FinalCtaSection from "../components/Landing/sections/final-cta";
import Footer from "../components/Landing/sections/footer";

// Import the scoped landing page styles
import "../styles/landing.css";

const LandingPage: React.FC = () => {
  return (
    <main className="landing-page min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesOverview />
      <InvoiceTemplatesSection />
      <OnlineGenerator />
      <EstimateTemplates />
      <ReceiptMakerSection />
      <ExpenseTracker />
      <FlexiblePayments />
      <AppFeaturesCta />
      <MobileShowcase />
      <CustomerStory />
      <TestimonialSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
