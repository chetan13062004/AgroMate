"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useRef } from "react"

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from)
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      const startTime = Date.now()
      const endTime = startTime + duration * 1000

      const updateCount = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / (endTime - startTime), 1)

        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(from + (to - from) * easeOutQuart)

        setCount(currentCount)

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        } else {
          setCount(to)
        }
      }

      requestAnimationFrame(updateCount)
    }
  }, [inView, from, to, duration])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  )
}
