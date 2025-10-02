// CategoryGrid.test.tsx
import { render, screen, within } from "@testing-library/react"
import { it, expect, vi } from "vitest"
import '@testing-library/jest-dom'
import React from "react"

// ✅ Mock shadcn/ui primitives so we only test our component’s behavior
vi.mock("@/components/ui/card", () => ({
  Card: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="card" {...props} />
  ),
  CardContent: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="card-content" {...props} />
  ),
}))
vi.mock("@/components/ui/badge", () => ({
  Badge: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="badge" {...props} />
  ),
}))

import { CategoryGrid } from "./category-grid"

describe("<CategoryGrid />", () => {
  it("renders the section heading and subtitle", () => {
    render(<CategoryGrid />)

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Everything You Need to Create Amazing Videos/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /Access millions of assets, AI tools, and templates/i
      )
    ).toBeInTheDocument()
  })

  it("renders all category cards (8)", () => {
    render(<CategoryGrid />)
    const cards = screen.getAllByTestId("card")
    expect(cards).toHaveLength(8)
  })

  it("shows title, description and item count badge for each card", () => {
    render(<CategoryGrid />)

    // A few spot checks (you can add more if you want)
    const aiVideos = screen.getByRole("heading", { level: 3, name: "AI-Generated Videos" })
      .closest('[data-testid="card"]') as HTMLElement
    expect(aiVideos).toBeInTheDocument()
    expect(within(aiVideos).getByText("Create videos from text prompts")).toBeInTheDocument()
    expect(within(aiVideos).getByTestId("badge")).toHaveTextContent("2.5M+")

    const templates = screen.getByRole("heading", { level: 3, name: "Video Templates" })
      .closest('[data-testid="card"]') as HTMLElement
    expect(within(templates).getByText("Professional templates for every need")).toBeInTheDocument()
    expect(within(templates).getByTestId("badge")).toHaveTextContent("50K+")
  })

  it("renders images with proper alt and src", () => {
    render(<CategoryGrid />)

    // Example: first card image
    const img = screen.getByAltText("AI-Generated Videos") as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.src).toMatch(/\/images\/ai-generated-video-creation-interface\.jpg$/)
    expect(img).toHaveClass("object-cover")
  })

  it("has expected grid breakpoints (class names present on grid container)", () => {
    render(<CategoryGrid />)
    // Locate the grid container by looking up any card and walking up to the grid
    const card = screen.getAllByTestId("card")[0]
    const grid = card.parentElement?.parentElement // CardContent -> grid
    // The exact DOM levels can change; adjust if needed
    expect(grid).toHaveClass("grid")
    expect(grid).toHaveClass("grid-cols-1")
    expect(grid).toHaveClass("md:grid-cols-2")
    expect(grid).toHaveClass("lg:grid-cols-4")
  })
})
