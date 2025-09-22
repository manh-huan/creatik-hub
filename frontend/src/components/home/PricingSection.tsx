'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for individuals and small projects",
    features: [
      "10 videos per month",
      "720p quality",
      "5 styles available",
      "Basic support"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$29", 
    period: "/month",
    description: "Ideal for content creators and small businesses",
    features: [
      "50 videos per month",
      "1080p quality", 
      "All styles available",
      "Priority support",
      "Team collaboration",
      "Custom branding"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month", 
    description: "For agencies and large organizations",
    features: [
      "Unlimited videos",
      "4K quality",
      "All styles + custom",
      "24/7 dedicated support",
      "Advanced team features",
      "White-label solution",
      "API access"
    ],
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include high-quality video generation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative ${plan.popular ? 'scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`bg-white/5 backdrop-blur-md p-8 rounded-2xl border ${plan.popular ? 'border-purple-500/50' : 'border-white/10'} hover:border-white/20 transition-all duration-300`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/60 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-white/70 mt-4">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-white/80">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signup"
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}