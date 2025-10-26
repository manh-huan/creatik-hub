import { Button } from "@/components/ui/button"
import { Badge } from "../ui/badge"

export function HeroSection() {
  return (
    <section className="relative bg-background py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Content */}
      <div className="relative max-w-7xl mx-auto text-center">
        <Badge variant="secondary" className="mb-6 bg-primary text-secondary-foreground border-secondary/30">
          ✨ AI-Powered Video Creation
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          Create Stunning Videos with <span className="text-primary">Faceless AI</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
          Transform your ideas into professional videos instantly. No cameras, no actors, no editing skills required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="btn-primary">
            Start Creating Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="btn-secondary"
          >
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>10M+ Videos Created</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span>500K+ Happy Creators</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>
    </section>
  )
}