'use client';

import { CategoryGrid } from "@/components/home/category-grid";
import { HeroSection } from "@/components/home/hero-section";

export default function HomePage() {
  return (
   <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <CategoryGrid />
      </main>
    </div>
  );
}