'use client';

import { Zap, Sparkles, Video, Users, CheckCircle, Star } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Generate high-quality videos in under 60 seconds. No more waiting hours for renders.",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "AI-Powered",
    description: "Advanced AI understands your text and creates visually stunning videos that match your vision.",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: <Video className="h-8 w-8" />,
    title: "Professional Quality",
    description: "Export in 4K resolution with professional-grade effects and transitions.",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team Collaboration",
    description: "Share projects with your team and collaborate in real-time on video creation.",
    color: "from-green-400 to-teal-500"
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Easy to Use",
    description: "No technical skills required. Just describe your video and let AI do the rest.",
    color: "from-indigo-400 to-purple-500"
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: "Multiple Styles",
    description: "Choose from various styles: realistic, animated, cinematic, and more.",
    color: "from-pink-400 to-red-500"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Every Creator
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Everything you need to create professional videos from text, powered by the latest AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}