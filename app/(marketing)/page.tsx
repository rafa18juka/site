import { HomeHero } from "@/components/sections/home-hero";
import { FeaturedModels } from "@/components/sections/featured-models";
import { CustomizationSection } from "@/components/sections/customization";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { WhySection } from "@/components/sections/why";
import { ShowroomSection } from "@/components/sections/showroom";
import { BlogHighlight } from "@/components/sections/blog-highlight";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedModels />
      <CustomizationSection />
      <TestimonialsSection />
      <WhySection />
      <ShowroomSection />
      <BlogHighlight />
      <CtaBanner />
    </>
  );
}