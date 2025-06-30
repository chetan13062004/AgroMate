"use client"

import { motion } from "framer-motion"

interface AnimatedLoadingProps {
  type?: "spinner" | "dots" | "pulse" | "wave" | "skeleton"
  size?: "sm" | "md" | "lg"
  color?: string
  text?: string
}

export default function AnimatedLoading({
  type = "spinner",
  size = "md",
  color = "text-green-600",
  text = "Loading...",
}: AnimatedLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const renderSpinner = () => (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-gray-200 border-t-current rounded-full ${color}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    />
  )

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full bg-current ${color}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-current ${color}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )

  const renderWave = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`w-1 bg-current ${color}`}
          animate={{
            height: ["10px", "30px", "10px"],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )

  const renderSkeleton = () => (
    <div className="space-y-3">
      <motion.div
        className="h-4 bg-gray-200 rounded"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="h-4 bg-gray-200 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
      />
      <motion.div
        className="h-4 bg-gray-200 rounded w-1/2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
      />
    </div>
  )

  const renderLoader = () => {
    switch (type) {
      case "dots":
        return renderDots()
      case "pulse":
        return renderPulse()
      case "wave":
        return renderWave()
      case "skeleton":
        return renderSkeleton()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderLoader()}
      {text && type !== "skeleton" && (
        <motion.p
          className="text-sm text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
