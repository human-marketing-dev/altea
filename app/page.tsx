import { Footer, NavBar } from "@/app/ui";
import { BusinessUnits } from "./_home/BusinessUnits";
import { ContactCTA } from "./_home/ContactCTA";
import { CorporateVideo } from "./_home/CorporateVideo";
import { Emblem } from "./_home/Emblem";
import { FeaturedProjects } from "./_home/FeaturedProjects";
import { Hero } from "./_home/Hero";
import { Stats } from "./_home/Stats";
import { WhyAltea } from "./_home/WhyAltea";
import "./_home/home.css";

export default function Home() {
  return (
    <>
      <NavBar tone="light" />
      <main>
        <Hero />
        <Stats />
        <CorporateVideo />
        <WhyAltea />
        <BusinessUnits />
        <Emblem />
        <ContactCTA />
        <FeaturedProjects />
      </main>
      <Footer />
    </>
  );
}
