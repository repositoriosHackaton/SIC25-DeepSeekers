"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return

    // Function to check if device is mobile
    const checkMobile = () => {
      // Check for touch capability
      const hasTouchScreen =
        ("maxTouchPoints" in navigator && navigator.maxTouchPoints > 0) ||
        ("msMaxTouchPoints" in navigator && (navigator as any).msMaxTouchPoints > 0)

      // Check screen width
      const isSmallScreen = window.innerWidth <= 768

      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent)

      // Consider it mobile if it has touch capability and either small screen or mobile user agent
      setIsMobile(hasTouchScreen && (isSmallScreen || isMobileUserAgent))
    }

    // Check initially
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}

