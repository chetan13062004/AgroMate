"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import LocationPicker from "@/components/maps/location-picker"
import { Upload, CheckCircle, AlertCircle, Camera, FileText, Leaf } from "lucide-react"

interface OnboardingData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    farmName: string
    experience: string
  }
  farmDetails: {
    farmSize: string
    farmType: string
    location: any
    description: string
    certifications: string[]
    specializations: string[]
  }
  businessInfo: {
    bankAccount: string
    ifscCode: string
    panNumber: string
    gstNumber: string
    businessType: string
  }
  documents: {
    farmPhotos: File[]
    certificationDocs: File[]
    identityProof: File | null
    bankProof: File | null
  }
}

const farmTypes = [
  "Organic Farm",
  "Traditional Farm",
  "Hydroponic Farm",
  "Greenhouse Farm",
  "Mixed Farming",
  "Livestock Farm",
]

const certifications = [
  "Organic Certified",
  "Fair Trade",
  "Rainforest Alliance",
  "Good Agricultural Practices (GAP)",
  "HACCP Certified",
  "ISO 22000",
]

const specializations = [
  "Vegetables",
  "Fruits",
  "Grains & Cereals",
  "Herbs & Spices",
  "Dairy Products",
  "Honey & Bee Products",
  "Flowers",
  "Medicinal Plants",
]

export default function FarmerOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      farmName: "",
      experience: "",
    },
    farmDetails: {
      farmSize: "",
      farmType: "",
      location: null,
      description: "",
      certifications: [],
      specializations: [],
    },
    businessInfo: {
      bankAccount: "",
      ifscCode: "",
      panNumber: "",
      gstNumber: "",
      businessType: "",
    },
    documents: {
      farmPhotos: [],
      certificationDocs: [],
      identityProof: null,
      bankProof: null,
    },
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (section: keyof OnboardingData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleArrayChange = (section: keyof OnboardingData, field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked
          ? [...(prev[section][field] as string[]), value]
          : (prev[section][field] as string[]).filter((item) => item !== value),
      },
    }))
  }

  const handleFileUpload = (section: keyof OnboardingData, field: string, files: FileList | null) => {
    if (!files) return

    if (field === "farmPhotos" || field === "certificationDocs") {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: Array.from(files),
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: files[0],
        },
      }))
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitApplication = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Store application data
    localStorage.setItem("farmerApplication", JSON.stringify(formData))

    // Redirect to success page
    router.push("/farmer-onboarding/success")
  }

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.personalInfo.fullName}
              onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.personalInfo.phone}
              onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="farmName">Farm Name *</Label>
            <Input
              id="farmName"
              value={formData.personalInfo.farmName}
              onChange={(e) => handleInputChange("personalInfo", "farmName", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="experience">Farming Experience</Label>
          <Select
            value={formData.personalInfo.experience}
            onValueChange={(value) => handleInputChange("personalInfo", "experience", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Less than 2 years</SelectItem>
              <SelectItem value="intermediate">2-5 years</SelectItem>
              <SelectItem value="experienced">5-10 years</SelectItem>
              <SelectItem value="expert">More than 10 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-green-600" />
            Farm Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farmSize">Farm Size (in acres) *</Label>
              <Input
                id="farmSize"
                value={formData.farmDetails.farmSize}
                onChange={(e) => handleInputChange("farmDetails", "farmSize", e.target.value)}
                placeholder="e.g., 5.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="farmType">Farm Type *</Label>
              <Select
                value={formData.farmDetails.farmType}
                onValueChange={(value) => handleInputChange("farmDetails", "farmType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select farm type" />
                </SelectTrigger>
                <SelectContent>
                  {farmTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Farm Description</Label>
            <Textarea
              value={formData.farmDetails.description}
              onChange={(e) => handleInputChange("farmDetails", "description", e.target.value)}
              placeholder="Describe your farm, farming practices, and what makes your produce special..."
              rows={4}
            />
          </div>

          <div>
            <Label>Certifications</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={cert}
                    checked={formData.farmDetails.certifications.includes(cert)}
                    onCheckedChange={(checked) =>
                      handleArrayChange("farmDetails", "certifications", cert, checked as boolean)
                    }
                  />
                  <Label htmlFor={cert} className="text-sm">
                    {cert}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Specializations *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {specializations.map((spec) => (
                <div key={spec} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec}
                    checked={formData.farmDetails.specializations.includes(spec)}
                    onCheckedChange={(checked) =>
                      handleArrayChange("farmDetails", "specializations", spec, checked as boolean)
                    }
                  />
                  <Label htmlFor={spec} className="text-sm">
                    {spec}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <LocationPicker
        onLocationSelect={(location) => handleInputChange("farmDetails", "location", location)}
        initialLocation={formData.farmDetails.location}
      />
    </div>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-green-600" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="businessType">Business Type *</Label>
          <Select
            value={formData.businessInfo.businessType}
            onValueChange={(value) => handleInputChange("businessInfo", "businessType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual Farmer</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="company">Private Limited Company</SelectItem>
              <SelectItem value="cooperative">Farmer Cooperative</SelectItem>
              <SelectItem value="fpo">Farmer Producer Organization (FPO)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankAccount">Bank Account Number *</Label>
            <Input
              id="bankAccount"
              value={formData.businessInfo.bankAccount}
              onChange={(e) => handleInputChange("businessInfo", "bankAccount", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="ifscCode">IFSC Code *</Label>
            <Input
              id="ifscCode"
              value={formData.businessInfo.ifscCode}
              onChange={(e) => handleInputChange("businessInfo", "ifscCode", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="panNumber">PAN Number *</Label>
            <Input
              id="panNumber"
              value={formData.businessInfo.panNumber}
              onChange={(e) => handleInputChange("businessInfo", "panNumber", e.target.value)}
              placeholder="ABCDE1234F"
              required
            />
          </div>
          <div>
            <Label htmlFor="gstNumber">GST Number (if applicable)</Label>
            <Input
              id="gstNumber"
              value={formData.businessInfo.gstNumber}
              onChange={(e) => handleInputChange("businessInfo", "gstNumber", e.target.value)}
              placeholder="22ABCDE1234F1Z5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2 text-green-600" />
          Document Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Farm Photos * (Upload 3-5 photos)</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload("documents", "farmPhotos", e.target.files)}
              className="hidden"
              id="farmPhotos"
            />
            <label htmlFor="farmPhotos" className="cursor-pointer">
              <Button variant="outline">Choose Farm Photos</Button>
            </label>
            <p className="text-sm text-gray-500 mt-2">{formData.documents.farmPhotos.length} photos selected</p>
          </div>
        </div>

        <div>
          <Label>Identity Proof * (Aadhar/Passport/Driving License)</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload("documents", "identityProof", e.target.files)}
              className="hidden"
              id="identityProof"
            />
            <label htmlFor="identityProof" className="cursor-pointer">
              <Button variant="outline">Upload Identity Proof</Button>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              {formData.documents.identityProof ? "File selected" : "No file selected"}
            </p>
          </div>
        </div>

        <div>
          <Label>Bank Proof * (Cancelled Cheque/Bank Statement)</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload("documents", "bankProof", e.target.files)}
              className="hidden"
              id="bankProof"
            />
            <label htmlFor="bankProof" className="cursor-pointer">
              <Button variant="outline">Upload Bank Proof</Button>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              {formData.documents.bankProof ? "File selected" : "No file selected"}
            </p>
          </div>
        </div>

        {formData.farmDetails.certifications.length > 0 && (
          <div>
            <Label>Certification Documents (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload("documents", "certificationDocs", e.target.files)}
                className="hidden"
                id="certificationDocs"
              />
              <label htmlFor="certificationDocs" className="cursor-pointer">
                <Button variant="outline">Upload Certificates</Button>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                {formData.documents.certificationDocs.length} documents selected
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Farmer Onboarding</h1>
        <p className="text-gray-600 mb-6">
          Join our marketplace and start selling your fresh produce directly to customers
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
              <span className={`ml-2 text-sm ${step <= currentStep ? "text-green-600 font-medium" : "text-gray-500"}`}>
                {step === 1 && "Personal Info"}
                {step === 2 && "Farm Details"}
                {step === 3 && "Business Info"}
                {step === 4 && "Documents"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>Next Step</Button>
        ) : (
          <Button onClick={submitApplication}>Submit Application</Button>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Need Help?</h4>
            <p className="text-sm text-blue-700">
              Our team reviews all applications within 24-48 hours. You'll receive an email confirmation once your
              application is approved. For questions, contact us at farmers@farmmarket.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
