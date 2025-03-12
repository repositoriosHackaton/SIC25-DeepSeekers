"use client"

import { ArrowLeft, Tag, ImageIcon, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApiResultsViewProps {
  image: string | null
  results: any
  onBack: () => void
}

export default function ApiResultsView({ image, results, onBack }: ApiResultsViewProps) {
  if (!results) return null

  const { analysis } = results

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-2xl bg-gray-100 p-6 shadow-neomorphic">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Resultados del Análisis</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Image preview */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-neomorphic-inset">
              {image && (
                <img
                  src={image || "/placeholder.svg"}
                  alt="Analyzed image"
                  className="max-h-[400px] w-full object-contain"
                />
              )}
            </div>

            {/* Metadata */}
            <div className="rounded-xl bg-white p-4 shadow-neomorphic-subtle">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                <ImageIcon className="mr-2 h-5 w-5 text-royal-blue" />
                Metadatos
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-gray-500">Formato:</div>
                <div className="font-semibold text-gray-800">{analysis.metadata.format}</div>

                <div className="font-medium text-gray-500">Dimensiones:</div>
                <div className="font-semibold text-gray-800">
                  {analysis.metadata.dimensions.width} x {analysis.metadata.dimensions.height} px
                </div>

                <div className="font-medium text-gray-500">Tamaño:</div>
                <div className="font-semibold text-gray-800">{analysis.metadata.size}</div>
              </div>
            </div>

            {/* Location */}
            {analysis.metadata.location && (
              <div className="rounded-xl bg-white p-4 shadow-neomorphic-subtle">
                <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                  <MapPin className="mr-2 h-5 w-5 text-royal-blue" />
                  Ubicación
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-gray-500">Latitud:</div>
                  <div className="font-semibold text-gray-800">{analysis.metadata.location.latitude}</div>

                  <div className="font-medium text-gray-500">Longitud:</div>
                  <div className="font-semibold text-gray-800">{analysis.metadata.location.longitude}</div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis results */}
          <div className="flex flex-col gap-4">
            {/* Objects detected */}
            <div className="rounded-xl bg-white p-4 shadow-neomorphic-subtle">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Objetos Detectados</h3>
              <div className="space-y-3">
                {analysis.objects.map((object: any, index: number) => (
                  <div key={index} className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{object.name}</span>
                      <span className="rounded-full bg-royal-blue px-2 py-1 text-xs font-medium text-white">
                        {Math.round(object.confidence * 100)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-royal-blue"
                        style={{ width: `${object.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="rounded-xl bg-white p-4 shadow-neomorphic-subtle">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Colores Predominantes</h3>
              <div className="space-y-3">
                {analysis.colors.map((color: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="mr-3 h-6 w-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{color.name}</span>
                        <span className="text-xs text-gray-500">{color.percentage}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${color.percentage}%`, backgroundColor: color.hex }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl bg-white p-4 shadow-neomorphic-subtle">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                <Tag className="mr-2 h-5 w-5 text-royal-blue" />
                Etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* API Info */}
            <div className="rounded-xl bg-white p-4 shadow-neomorphic-subtle">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>API: api.example.com/analyze</span>
                <span>Timestamp: {new Date(results.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

