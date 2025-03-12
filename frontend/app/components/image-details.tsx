"use client"

import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageDetailsProps {
  image: string | null
  imageInfo: {
    width: number
    height: number
    size: string
    type: string
  } | null
  onBack: () => void
}

export default function ImageDetails({ image, imageInfo, onBack }: ImageDetailsProps) {
  const handleDownload = () => {
    if (!image) return

    const link = document.createElement("a")
    link.href = image
    link.download = `image.${imageInfo?.type.toLowerCase() || "jpg"}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl bg-gray-100 p-8 shadow-neomorphic">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Detalles de la Imagen</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-neomorphic-inset">
              {image && (
                <img
                  src={image || "/placeholder.svg"}
                  alt="Uploaded image"
                  className="max-h-[400px] w-full object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-6 rounded-xl bg-white p-6 shadow-neomorphic-subtle">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Información</h2>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-gray-500">Dimensiones:</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {imageInfo?.width} x {imageInfo?.height} px
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-gray-500">Tamaño:</div>
                  <div className="text-sm font-semibold text-gray-800">{imageInfo?.size}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-gray-500">Tipo:</div>
                  <div className="text-sm font-semibold text-gray-800">{imageInfo?.type}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-gray-500">Relación de aspecto:</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {imageInfo ? (imageInfo.width / imageInfo.height).toFixed(2) : "-"}
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full rounded-xl bg-royal-blue py-3 font-medium text-white shadow-button transition-all hover:shadow-button-hover"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Descargar Imagen</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

