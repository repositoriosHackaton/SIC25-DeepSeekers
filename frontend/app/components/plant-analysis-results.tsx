"use client"

import { ArrowLeft, Leaf, AlertTriangle, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlantAnalysisResultsProps {
  image: string | null
  results: Record<string, number>
  dimensions: { width: number; height: number } | null
  error: string | null
  onBack: () => void
}

export default function PlantAnalysisResults({ image, results, dimensions, error, onBack }: PlantAnalysisResultsProps) {
  if (!results) return null

  // Process results to group by plant type and condition
  const processedResults = Object.entries(results).reduce(
    (acc, [key, value]) => {
      // Parse the key to extract plant type and condition
      // Format: "Manzana___Podredumbre_negra", "Maíz___saludable"
      const [plantType, condition] = key.split("___")

      // Initialize plant entry if it doesn't exist
      if (!acc[plantType]) {
        acc[plantType] = {
          conditions: [],
          totalProbability: 0,
        }
      }

      // Check if condition indicates healthy plant
      const isHealthy = condition.toLowerCase() === "saludable"

      // Add condition and update total probability
      acc[plantType].conditions.push({
        name: condition.replace(/_/g, " "),
        probability: value,
        isHealthy: isHealthy,
      })

      acc[plantType].totalProbability += value

      return acc
    },
    {} as Record<
      string,
      {
        conditions: Array<{ name: string; probability: number; isHealthy: boolean }>
        totalProbability: number
      }
    >,
  )

  // Find the plant with the highest probability
  const plantEntries = Object.entries(processedResults)
  const mostLikelyPlant = plantEntries.reduce((prev, current) => {
    return current[1].totalProbability > prev[1].totalProbability ? current : prev
  })

  // Find the most likely condition for the most likely plant
  const plantName = mostLikelyPlant[0]
  const conditions = mostLikelyPlant[1].conditions.sort((a, b) => b.probability - a.probability)
  const mostLikelyCondition = conditions[0]

  // Check if the plant is healthy
  const isHealthy = mostLikelyCondition.isHealthy
  const confidence = mostLikelyCondition.probability * 100

  // Get health status color
  const getStatusColor = (isHealthy: boolean) => {
    if (isHealthy) {
      return {
        bg: "bg-green-500",
        text: "text-green-800",
        light: "bg-green-100",
        border: "border-green-200",
        status: "Saludable",
      }
    } else {
      return {
        bg: "bg-red-500",
        text: "text-red-800",
        light: "bg-red-100",
        border: "border-red-200",
        status: "Enferma",
      }
    }
  }

  const statusColor = getStatusColor(isHealthy)

  // Format probability for display
  const formatProbability = (value: number) => {
    return (value * 100).toFixed(2) + "%"
  }

  // Find the maximum probability across all conditions to scale the bars
  const maxProbability = Math.max(...Object.values(results))

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl bg-gray-100 p-6 shadow-neomorphic">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Resultados del Análisis</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <div className="flex items-start">
              <AlertTriangle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Nota sobre los datos</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Image preview */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-neomorphic-inset">
              {image && (
                <img
                  src={image || "/placeholder.svg"}
                  alt="Analyzed plant"
                  className="max-h-[400px] w-full object-contain"
                />
              )}
            </div>

            {/* Dimensions */}
            {dimensions && (
              <div className="rounded-xl bg-white p-4 shadow-neomorphic-subtle">
                <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                  <Ruler className="mr-2 h-5 w-5 text-royal-blue" />
                  Dimensiones
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-gray-500">Ancho:</div>
                  <div className="font-semibold text-gray-800">{dimensions.width} px</div>

                  <div className="font-medium text-gray-500">Alto:</div>
                  <div className="font-semibold text-gray-800">{dimensions.height} px</div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis results */}
          <div className="flex flex-col gap-4">
            {/* Main result */}
            <div className={`rounded-xl ${statusColor.light} p-6 shadow-neomorphic-subtle`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Diagnóstico</h3>
                <span className={`rounded-full ${statusColor.bg} px-3 py-1 text-sm font-medium text-white`}>
                  {formatProbability(mostLikelyCondition.probability)}
                </span>
              </div>

              <div className="mb-4 flex items-center">
                <Leaf className={`mr-3 h-8 w-8 ${statusColor.text}`} />
                <div>
                  <div className="text-lg font-semibold text-gray-800">{plantName}</div>
                  <div className={`text-sm font-medium ${statusColor.text}`}>
                    {isHealthy ? "Saludable" : mostLikelyCondition.name}
                  </div>
                </div>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div className={`h-full ${statusColor.bg}`} style={{ width: `${Math.min(confidence, 100)}%` }}></div>
              </div>
            </div>

            {/* Detailed results */}
            <div className="rounded-xl bg-white p-4 shadow-neomorphic-subtle">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Resultados Detallados</h3>

              <div className="space-y-4">
                {Object.entries(processedResults)
                  .sort((a, b) => b[1].totalProbability - a[1].totalProbability)
                  .map(([plant, data]) => (
                    <div key={plant} className="rounded-lg bg-gray-50 p-3">
                      <div className="mb-2 font-semibold text-gray-800">{plant}</div>

                      <div className="space-y-2">
                        {data.conditions
                          .sort((a, b) => b.probability - a.probability)
                          .map((condition, index) => (
                            <div key={index} className="grid grid-cols-2 gap-2">
                              <div className="text-sm font-medium text-gray-700">
                                {condition.isHealthy ? (
                                  <span className="text-green-600">Saludable</span>
                                ) : (
                                  condition.name
                                )}
                              </div>
                              <div className="flex items-center">
                                <div
                                  className={`mr-2 h-2 flex-grow rounded-full ${condition.isHealthy ? "bg-green-500" : "bg-red-500"}`}
                                  style={{
                                    width: `${(condition.probability / maxProbability) * 100}%`,
                                    maxWidth: "100px",
                                  }}
                                ></div>
                                <span className="text-xs font-semibold text-gray-700">
                                  {formatProbability(condition.probability)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* API Info */}
            <div className="rounded-xl bg-white p-3 shadow-neomorphic-subtle">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>API: deepseekers-crops-disease-recognition.onrender.com</span>
                <span>Timestamp: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

