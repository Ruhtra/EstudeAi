"use client"

import type React from "react"
import { useRef } from "react"
import { motion } from "framer-motion"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"

interface ScrollAnimationProps {
  children: React.ReactNode
  threshold?: number
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ children, threshold = 0.1 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useIntersectionObserver({ ref, threshold })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.div>
  )
}

