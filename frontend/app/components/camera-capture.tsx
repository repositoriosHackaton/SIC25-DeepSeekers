"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, RotateCcw } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void
  onCancel: () => void
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  useEffect(() => {
    // Start camera
    startCamera()

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      // Get new stream
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      setStream(newStream)
      setError(null)

      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
    }
  }

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      setHasPhoto(true)
    }
  }

  const retakePhoto = () => {
    setHasPhoto(false)
  }

  const savePhoto = () => {
    if (!canvasRef.current) return

    const dataUrl = canvasRef.current.toDataURL("image/jpeg")
    onCapture(dataUrl)
  }

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-gray-100 p-6 shadow-neomorphic">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Cámara</h2>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
            <p>{error}</p>
          </div>
        ) : (
          <div className="relative mb-4 overflow-hidden rounded-xl bg-black shadow-neomorphic-inset">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`h-full w-full object-cover ${hasPhoto ? "hidden" : "block"}`}
            />
            <canvas ref={canvasRef} className={`h-full w-full object-cover ${hasPhoto ? "block" : "hidden"}`} />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!hasPhoto ? (
            <>
              <Button
                className="w-full rounded-xl bg-royal-blue py-3 font-medium text-white shadow-button transition-all hover:shadow-button-hover"
                onClick={takePhoto}
              >
                <Camera className="mr-2 h-4 w-4" />
                <span>Tomar foto</span>
              </Button>

              <Button
                variant="outline"
                className="w-full rounded-xl py-3 font-medium shadow-button transition-all hover:shadow-button-hover"
                onClick={switchCamera}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                <span>Cambiar cámara</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                className="w-full rounded-xl bg-royal-blue py-3 font-medium text-white shadow-button transition-all hover:shadow-button-hover"
                onClick={savePhoto}
              >
                <span>Usar esta foto</span>
              </Button>

              <Button
                variant="outline"
                className="w-full rounded-xl py-3 font-medium shadow-button transition-all hover:shadow-button-hover"
                onClick={retakePhoto}
              >
                <span>Tomar otra foto</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

