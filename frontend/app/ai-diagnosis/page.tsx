"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Camera, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react"

interface DiagnosisResult {
  disease: string
  confidence: number
  severity: "Low" | "Medium" | "High"
  treatment: string[]
  prevention: string[]
  description: string
}

export default function AIDiagnosisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: selectedImage }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || "Unexpected error")
      }

      const data = await res.json()
      setResult(data as DiagnosisResult)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to analyze image")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "High":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Crop Disease Detection</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload a photo of your crop to get instant AI-powered disease diagnosis and treatment recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Upload Crop Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Drag and drop an image here, or click to select</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button asChild className="cursor-pointer">
                      <span>Choose Image</span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Image
                      src={selectedImage}
                      alt="Uploaded crop"
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={analyzeImage} disabled={isAnalyzing || !selectedImage}>
                      {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                    </Button>
                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null)
                        setResult(null)
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Analyzing image...</p>
                  <Progress value={33} className="w-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Diagnosis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Upload and analyze an image to see results</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      if (result) {
                        localStorage.setItem("diagnosisDescription", result.description)
                        localStorage.setItem("diagnosisDisease", result.disease)
                        localStorage.setItem("diagnosisConfidence", result.confidence.toString())
                        localStorage.setItem("diagnosisSeverity", result.severity)
                        localStorage.setItem("diagnosisTreatment", JSON.stringify(result.treatment))
                        localStorage.setItem("diagnosisPrevention", JSON.stringify(result.prevention))
                      }
                    }}
                  >
                    Use as Product Description
                  </Button>
                </div>
                <div className="space-y-6">
                  {/* Disease Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{result.disease}</h3>
                      <Badge className={getSeverityColor(result.severity)}>{result.severity} Risk</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{result.description}</p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                      <Progress value={result.confidence} className="flex-1 mr-2" />
                      <span className="text-sm font-medium">{result.confidence}%</span>
                    </div>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Treatment Steps
                    </h4>
                    <ul className="space-y-1">
                      {result.treatment.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                      Prevention Tips
                    </h4>
                    <ul className="space-y-1">
                      {result.prevention.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-yellow-600 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* FIX: This closing div tag was missing. */}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tips for Better Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Clear Images</h4>
                <p className="text-sm text-gray-600">Take clear, well-lit photos of affected areas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Close-up Shots</h4>
                <p className="text-sm text-gray-600">Focus on the diseased parts of the plant</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Multiple Angles</h4>
                <p className="text-sm text-gray-600">Take photos from different angles for better analysis</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Natural Light</h4>
                <p className="text-sm text-gray-600">Use natural daylight for accurate color representation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}