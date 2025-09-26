import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const categories = [
  {
    title: "AI-Generated Videos",
    description: "Create videos from text prompts",
    itemCount: "2.5M+",
    image: "/images/ai-generated-video-creation-interface.jpg",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Video Templates",
    description: "Professional templates for every need",
    itemCount: "50K+",
    image: "/images/video-template-library-interface.jpg",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    title: "Stock Footage",
    description: "High-quality stock video clips",
    itemCount: "1M+",
    image: "/images/stock-footage-video-library.jpg",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    title: "Sound Effects",
    description: "Professional audio for your videos",
    itemCount: "100K+",
    image: "/images/sound-effects-audio-waveform.jpg",
    gradient: "from-chart-1/20 to-chart-1/5",
  },
  {
    title: "AI Avatars",
    description: "Realistic AI presenters and characters",
    itemCount: "500+",
    image: "/images/ai-avatar-digital-human-presenter.jpg",
    gradient: "from-chart-2/20 to-chart-2/5",
  },
  {
    title: "Music Library",
    description: "Royalty-free music tracks",
    itemCount: "25K+",
    image: "/images/music-library-audio-tracks-interface.jpg",
    gradient: "from-chart-3/20 to-chart-3/5",
  },
  {
    title: "Graphics & Assets",
    description: "Icons, animations, and visual elements",
    itemCount: "200K+",
    image: "/images/graphics-assets-icons-animations.jpg",
    gradient: "from-chart-4/20 to-chart-4/5",
  },
  {
    title: "Voice Synthesis",
    description: "AI-powered text-to-speech voices",
    itemCount: "150+",
    image: "/images/voice-synthesis-ai-text-to-speech.jpg",
    gradient: "from-chart-5/20 to-chart-5/5",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Everything You Need to Create Amazing Videos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Access millions of assets, AI tools, and templates to bring your creative vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer overflow-hidden"
            >
              <CardContent className="p-0">
                <div className={`relative h-48 bg-gradient-to-br ${category.gradient} overflow-hidden`}>
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={index < 4}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/80 text-foreground">
                      {category.itemCount}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
