'use client';

import Navigation from '../components/layout/Navigation';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import PricingSection from '../components/home/PricingSection';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <HeroSection />
      
      {/* Video Demo Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-md w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                  <svg className="h-8 w-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white/80 text-lg">Watch how it works</p>
                <p className="text-white/60 text-sm mt-2">See text transform into video in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      
      {/* How It Works Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Create stunning videos in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe Your Video",
                description: "Simply type what you want to see. Be as creative as you like - our AI understands natural language.",
                example: '"A sunset over mountains with birds flying"'
              },
              {
                step: "02", 
                title: "AI Creates Magic",
                description: "Our advanced AI analyzes your description and generates a professional video in seconds.",
                example: "Processing... 🎬"
              },
              {
                step: "03",
                title: "Download & Share",
                description: "Get your video in high quality and share it anywhere - social media, websites, presentations.",
                example: "Ready to download! ✨"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-white/70 mb-4 leading-relaxed">{step.description}</p>
                <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 inline-block">
                  <code className="text-purple-300 text-sm">{step.example}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md p-12 rounded-3xl border border-white/20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Create Amazing Videos?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using AI to bring their ideas to life.
              Start your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth/signup"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Start Free Trial
              </a>
              
              <a 
                href="/contact"
                className="text-white/80 hover:text-white px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}