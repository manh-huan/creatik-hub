'use client';

import { CategoryGrid } from "@/components/home/category-grid";
import { HeroSection } from "@/components/home/hero-section";
import Footer from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";

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
}