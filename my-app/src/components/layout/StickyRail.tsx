"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyTakeaways } from "../modules/KeyTakeaways"

interface StickyRailProps {
  toc: Array<{ id: string; label: string }>
  keyTakeaways?: string[]
}

export function StickyRail({ toc, keyTakeaways }: StickyRailProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => {
      const sections = toc.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]

      if (sections.length === 0) return

      // Find the section that's currently most visible in viewport
      let currentSection: HTMLElement | null = null
      let maxVisibility = 0

      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Calculate how much of the section is visible
        const visibleTop = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0))
        const visibility = visibleTop / viewportHeight

        if (visibility > maxVisibility && rect.top < viewportHeight / 2) {
          maxVisibility = visibility
          currentSection = section
        }
      }

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    handleScroll() // Run on mount
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [toc])

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 space-y-6 border-none shadow-none">
        {/* Scroll progress indicator */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 bg-muted rounded-full overflow-hidden w-0"
          style={{ height: "100%" }}
        >
          <motion.div className="w-full bg-primary origin-top" style={{ scaleY, transformOrigin: "top" }} />
        </motion.div>

        {/* Table of Contents */}
        <Card className="glass-card bg-slate-100 border-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-1">
              {toc.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleTocClick(e, item.id)}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`block text-sm py-2.5 px-4 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        {keyTakeaways && keyTakeaways.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <KeyTakeaways items={keyTakeaways} />
          </motion.div>
        )}
      </div>
    </aside>
  )
}
