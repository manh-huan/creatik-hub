'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import { ArrowRight, Play, Star, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-white/90 text-sm font-medium">
              AI-Powered Video Generation
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Words{' '}
            </span>
            Into Stunning Videos
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Create professional videos from simple text descriptions using cutting-edge AI technology. 
            No filming, no editing, no hassle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href={isAuthenticated ? "/dashboard/generate" : "/auth/signup"}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Start Creating Now
              <ArrowRight className="inline ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group flex items-center text-white/80 hover:text-white px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white/20" />
                ))}
              </div>
              <span className="ml-3 text-sm">2,000+ creators trust us</span>
            </div>
            
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
}