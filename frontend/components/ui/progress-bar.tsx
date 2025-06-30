"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: string
  animated?: boolean
}

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  showLabel = false,
  color = "bg-blue-600",
  animated = true,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayValue(percentage), 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayValue(percentage)
    }
  }, [percentage, animated])

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <motion.div
          className="text-sm text-gray-600 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(displayValue)}%
        </motion.div>
      )}
    </div>
  )
}
