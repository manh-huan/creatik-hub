'use client';
import Link from 'next/Link'
import { Button } from '../ui/button'
//import { useRouter } from 'next/navigation'

export function Navigation() {
  //const router = useRouter();
  //const handleLogin = () => {
  //  router.push('/auth/login');
  //};

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <span className="font-medium">🎉 Limited Time: Get 50% off your first month!</span>
        <Link href="#" className="text-primary-foreground underline ml-2 p-0 h-auto">
          Claim Offer
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                 {/*  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d=" />
                    </svg>
                  </div> */}
                <span className="text-xl font-bold text-foreground">Faceless AI Video</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/"
                  className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                >
                  Resources
                </Link>
                <Link
                  href="/auth/login"
                //   onClick={(e) => {
                //   e.preventDefault(); // Prevent default anchor behavior
                //   handleLogin();
                // }}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}