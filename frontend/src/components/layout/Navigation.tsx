import Link from "next/link";

export default function Navigation() {
  return (
    <>
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-[#9c6bff] to-[#7b61ff] text-white py-2 text-center text-sm">
        <span className="font-medium">🎉 Get 50% off your first month!</span>
        <Link href="/signup" className="underline ml-2 hover:opacity-90">
          Claim Offer
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 ">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#9c6bff] to-[#7b61ff]" /> */}
            <span className="text-lg font-bold">Creatik-hub</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="nav-link">
              Home
            </Link>
            <Link href="#features" className="nav-link">
              Features
            </Link>
            <Link href="#pricing" className="nav-link">
              Pricing
            </Link>
            <Link href="#resources" className="nav-link">
              Resources
            </Link>
            <Link href="/login" className="nav-link">
              Login
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center">
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
