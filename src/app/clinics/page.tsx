"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Hospital, MapPin, Phone, Clock } from "lucide-react"
import { LocationForm } from "@/components/location-form"
import { ClinicSearch } from "@/components/clinic-search"
import { LocationCoordinates } from "@/lib/location"
import { Clinic } from "@/lib/clinics"
import { ErrorHandler, type ApiError } from "@/components/error-handler"
import { ClinicSearchLoading } from "@/components/loading-states"

export default function ClinicsPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [showSearch, setShowSearch] = useState(false)

  const handleLocationSelected = (location: LocationCoordinates, address?: string) => {
    setSelectedLocation(location)
    setSelectedAddress(address || "")
    setShowSearch(true)
  }

  const handleClinicSelect = (clinic: Clinic) => {
    console.log('Selected clinic:', clinic)
    // This could navigate to a clinic detail page or show more info
  }
  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Find Clinics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mx-auto max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Hospital className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Emergency Clinics
            </h1>
            <p className="text-gray-600">
              Locate nearby healthcare facilities and emergency services
            </p>
          </div>

          {/* Location Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Location Search
              </CardTitle>
              <CardDescription>
                Find clinics near your current location or search by address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationForm onLocationSelected={handleLocationSelected} />
            </CardContent>
          </Card>

          {/* Clinic Search Results */}
          {showSearch && selectedLocation && (
            <ClinicSearch
              location={selectedLocation}
              address={selectedAddress}
              onClinicSelect={handleClinicSelect}
            />
          )}

          {/* Sample Clinic Cards for Demo - Only show when no search is active */}
          {!showSearch && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <Hospital className="h-5 w-5" />
                    Lagos General Hospital
                  </CardTitle>
                  <CardDescription>
                    Emergency and general medical services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Broad Street, Lagos Island, Lagos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>+234 1 234 5678</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>24/7 Emergency Services</span>
                  </div>
                  <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Hospital className="h-5 w-5" />
                    National Hospital Abuja
                  </CardTitle>
                  <CardDescription>
                    Specialized medical care and emergency services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Central Business District, Abuja</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>+234 9 876 5432</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>24/7 Emergency Services</span>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}