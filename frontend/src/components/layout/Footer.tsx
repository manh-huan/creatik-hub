'use client';

import Link from 'next/link';
import { Video } from 'lucide-react';

const footerLinks = {
  product: [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '/examples', label: 'Examples' },
  ],
  support: [
    { href: '/help', label: 'Help Center' },
    { href: '/contact', label: 'Contact' },
    { href: '/status', label: 'Status' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/privacy', label: 'Privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-background border-t border-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-6 no-underline group">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-2.5 rounded-xl group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                <Video className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="ml-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Creatik Hub
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Transform your words into stunning videos with the power of AI.
            </p>
            {/* Social links placeholder - you can add actual social media links here */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors">
                <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors">
                <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors">
                <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Navigation sections */}
          <div>
            <h4 className="text-foreground font-semibold mb-6 text-sm uppercase tracking-wide">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm no-underline hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm no-underline hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm no-underline hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Creatik Hub. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors no-underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors no-underline">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors no-underline">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}