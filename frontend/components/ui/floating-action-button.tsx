"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface FloatingActionButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

export default function FloatingActionButton({
  children,
  onClick,
  className = "",
  position = "bottom-right",
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        onClick={onClick}
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        size="icon"
      >
        {children}
      </Button>
    </motion.div>
  )
}
