"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Menu, Info, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import PlantAnalysisResults from "./components/plant-analysis-results"
import CameraCapture from "./components/camera-capture"
import { useIsMobile } from "@/hooks/use-mobile"

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [apiResults, setApiResults] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<{
    width: number
    height: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) return

    setIsUploading(true)
    setIsUploaded(false)
    setError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      // Get image data
      const dataUrl = e.target?.result as string
      setImage(dataUrl)

      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        setImageInfo({
          width: img.width,
          height: img.height,
        })
        setIsUploading(false)
        setIsUploaded(true)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = (dataUrl: string) => {
    setIsUploading(true)
    setIsUploaded(false)
    setShowCamera(false)
    setError(null)

    // Get image dimensions
    const img = new Image()
    img.onload = () => {
      setImageInfo({
        width: img.width,
        height: img.height,
      })
      setImage(dataUrl)
      setIsUploading(false)
      setIsUploaded(true)
    }
    img.src = dataUrl
  }

  const removeImage = () => {
    setImage(null)
    setIsUploaded(false)
    setShowResults(false)
    setApiResults(null)
    setError(null)
    setImageInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const processImageWithApi = async () => {
    if (!image) return

    setIsProcessing(true)
    setError(null)

    try {
      // Usar datos de ejemplo para demostración ya que la API está caída
      // En un entorno de producción, descomentar el código de abajo para conectar con la API real

      
      // Convert base64 to blob
      const base64Response = await fetch(image);
      const blob = await base64Response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');
      
      // Send to API
      const response = await fetch('http://127.0.0.1:8000/api/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setApiResults(data);
      /*
      // Simular un retraso para la demostración
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Usar datos de ejemplo con el nuevo formato en español para la demostración
      const mockApiResponse = {
        Manzana___Podredumbre_negra: 0.022210918366909027,
        Manzana___Roña_del_manzano: 0.6731756329536438,
        Manzana___saludable: 0.2475418746471405,
        Maíz___Mancha_foliar_por_Cercospora: 0.02118958719074726,
        Maíz___Tizón_foliar_norteño: 0.0009554149582982063,
        Maíz___saludable: 0.013545230962336063,
        Tomate___Mancha_foliar_por_Septoriosis: 0.007391240913420916,
        Tomate___Tizón_tardío: 0.0006959199672564864,
        Tomate___saludable: 0.002276195678859949,
        Uva___Sarampión_negro: 0.0017166787292808294,
        Uva___Tizón_foliar_Isariopsis: 0.001491655595600605,
        Uva___saludable: 0.007809591479599476,
      }

      setApiResults(mockApiResponse)*/
      setShowResults(true)
      //setError("Usando datos de ejemplo para la demostración. En producción, esto conectaría con la API real.")
    } catch (err) {
      console.error("Error processing image:", err)

      // Proporcionar un mensaje de error más descriptivo
      let errorMessage = "Error al procesar la imagen. "

      if (err instanceof TypeError && err.message === "Failed to fetch") {
        errorMessage += "No se pudo conectar con el servidor. Verifica tu conexión a internet o inténtalo más tarde."
      } else {
        errorMessage += err instanceof Error ? err.message : "Ocurrió un error desconocido."
      }

      setError(errorMessage)

      // Usar datos de ejemplo como fallback con el nuevo formato en español
      const mockApiResponse = {
        Manzana___Podredumbre_negra: 0.022210918366909027,
        Manzana___Roña_del_manzano: 0.6731756329536438,
        Manzana___saludable: 0.2475418746471405,
        Maíz___Mancha_foliar_por_Cercospora: 0.02118958719074726,
        Maíz___Tizón_foliar_norteño: 0.0009554149582982063,
        Maíz___saludable: 0.013545230962336063,
        Tomate___Mancha_foliar_por_Septoriosis: 0.007391240913420916,
        Tomate___Tizón_tardío: 0.0006959199672564864,
        Tomate___saludable: 0.002276195678859949,
        Uva___Sarampión_negro: 0.0017166787292808294,
        Uva___Tizón_foliar_Isariopsis: 0.001491655595600605,
        Uva___saludable: 0.007809591479599476,
      }

      setApiResults(mockApiResponse)
      setShowResults(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const viewImageDetails = () => {
    processImageWithApi()
  }

  const backToUpload = () => {
    setShowResults(false)
  }

  const openCamera = () => {
    setShowCamera(true)
  }

  const closeCamera = () => {
    setShowCamera(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-royal-blue shadow-neomorphic-blue">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">Reconocimiento de enfermedades en plantas de cultivo</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-royal-blue-light">
                  Sobre nosotros
                </a>
              </div>
            </div>
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-royal-blue-light"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 bg-royal-blue-dark px-2 pb-3 pt-2">
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-royal-blue-light"
              >
                Sobre nosotros
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        {showCamera ? (
          <CameraCapture onCapture={handleCameraCapture} onCancel={closeCamera} />
        ) : !showResults ? (
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-gray-100 p-8 shadow-neomorphic">
              <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Analizar Planta</h1>

              <div
                className={cn(
                  "relative mb-6 flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 p-4 transition-all duration-300 ease-in-out",
                  isDragging && "border-royal-blue",
                  image && "border-none",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {!image ? (
                  <>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    <div className="flex flex-col items-center">
                      <ImageIcon className="mb-2 h-16 w-16 text-gray-400" />
                      <p className="mb-2 text-center text-sm text-gray-500">
                        Arrastra y suelta una imagen de planta aquí, o haz clic para seleccionar
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF hasta 10MB</p>
                    </div>
                  </>
                ) : (
                  <div className="relative h-full w-full">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Uploaded preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      className="absolute right-2 top-2 rounded-full bg-gray-800 p-1 text-white opacity-80 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage()
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {error && !showResults && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>
              )}

              {isMobile && !image && (
                <Button
                  className="mb-4 w-full rounded-xl bg-royal-blue py-3 font-medium text-white shadow-button transition-all hover:shadow-button-hover"
                  onClick={openCamera}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  <span>Tomar foto con la cámara</span>
                </Button>
              )}

              {isUploaded ? (
                <Button
                  className="w-full rounded-xl bg-royal-blue py-3 font-medium text-white shadow-button transition-all hover:shadow-button-hover"
                  onClick={viewImageDetails}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Analizando planta...</span>
                    </div>
                  ) : (
                    <>
                      <Info className="mr-2 h-4 w-4" />
                      <span>Analizar planta</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  className={cn(
                    "w-full rounded-xl bg-royal-blue py-3 font-medium text-white shadow-button transition-all hover:shadow-button-hover",
                    isUploading && "cursor-not-allowed opacity-70",
                  )}
                  disabled={isUploading || !image}
                  onClick={() => {
                    if (image && !isUploaded) {
                      setIsUploading(true)
                      setTimeout(() => {
                        setIsUploading(false)
                        setIsUploaded(true)
                      }, 1000)
                    }
                  }}
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Subiendo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Subir Imagen</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <PlantAnalysisResults
            image={image}
            results={apiResults}
            dimensions={imageInfo}
            error={error}
            onBack={backToUpload}
          />
        )}
      </div>
    </div>
  )
}

