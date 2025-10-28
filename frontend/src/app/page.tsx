'use client';

import { CategoryGrid } from "@/components/home/category-grid";
import { HeroSection } from "@/components/home/hero-section";
import Footer from "@/components/layout/Footer";
import  Navigation  from "@/components/layout/Navigation";

export default function HomePage() {
  return (
   <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CategoryGrid />
      </main>
      <Footer />
    </div>
  );
  var thisIsAVeryLongVariableNameThatExceedsTheRecommendedLineLengthLimit = { 'key': 'value' , 'anotherKey': 'anotherValue'   , 'thirdKey': 'thirdValue'    , 'fourthKey': 'fourthValue'    , 'fifthKey': 'fifthValue'  };
}