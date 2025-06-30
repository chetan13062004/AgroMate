"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  loading?: boolean
}

export default function AnimatedButton({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  type = "button",
  loading = false,
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant={variant}
        size={size}
        className={`relative overflow-hidden ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        type={type}
      >
        <motion.div className="flex items-center justify-center" animate={loading ? { opacity: 0.7 } : { opacity: 1 }}>
          {loading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>
          )}
          {children}
        </motion.div>
      </Button>
    </motion.div>
  )
}
