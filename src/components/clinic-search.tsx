"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Hospital, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Search,
  AlertCircle,
  Navigation2
} from "lucide-react"
import { LocationCoordinates } from "@/lib/location"
import { ClinicService, Clinic, ClinicSearchParams } from "@/lib/clinics"

interface ClinicSearchProps {
  location: LocationCoordinates
  address?: string
  onClinicSelect?: (clinic: Clinic) => void
}

export function ClinicSearch({ location, address, onClinicSelect }: ClinicSearchProps) {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [radiusFilter, setRadiusFilter] = useState("10")
  const [emergencyOnly, setEmergencyOnly] = useState(false)
  const [expandedRadius, setExpandedRadius] = useState(false)

  // Search for clinics when location changes
  useEffect(() => {
    if (location) {
      searchClinics()
    }
  }, [location])

  // Filter clinics when search query or filters change
  useEffect(() => {
    filterClinics()
  }, [clinics, searchQuery, emergencyOnly])

  const searchClinics = async (radius?: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams: ClinicSearchParams = {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radius || parseInt(radiusFilter),
        emergency_only: emergencyOnly
      }

      const results = await ClinicService.searchClinics(searchParams)
      setClinics(results)

      // Show radius expansion notification if no results and not already expanded
      if (results.length === 0 && !expandedRadius && parseInt(radiusFilter) < 50) {
        setExpandedRadius(true)
        // Auto-expand radius and search again
        const newRadius = Math.min(parseInt(radiusFilter) * 2, 50)
        setRadiusFilter(newRadius.toString())
        setTimeout(() => searchClinics(newRadius), 1000)
      }
    } catch (err) {
      setError("Unable to find clinics. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const filterClinics = () => {
    let filtered = clinics

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(clinic =>
        clinic.name.toLowerCase().includes(query) ||
        clinic.address.toLowerCase().includes(query) ||
        clinic.services.some(service => service.toLowerCase().includes(query))
      )
    }

    // Filter by emergency status
    if (emergencyOnly) {
      filtered = filtered.filter(clinic => clinic.is_emergency)
    }

    setFilteredClinics(filtered)
  }

  const handleRadiusChange = (newRadius: string) => {
    setRadiusFilter(newRadius)
    setExpandedRadius(false)
    searchClinics(parseInt(newRadius))
  }

  const handleEmergencyToggle = (emergency: boolean) => {
    setEmergencyOnly(emergency)
    if (emergency) {
      searchClinics() // Re-search with emergency filter
    }
  }

  const getDirectionsUrl = (clinic: Clinic) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`
  }

  const callClinic = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <Label htmlFor="clinic-search" className="text-sm font-medium">
              Search Clinics
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="clinic-search"
                placeholder="Search by name, location, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Radius Filter */}
          <div className="w-full sm:w-48">
            <Label className="text-sm font-medium">Search Radius</Label>
            <Select value={radiusFilter} onValueChange={handleRadiusChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="20">20 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Emergency Filter */}
          <div className="w-full sm:w-48">
            <Label className="text-sm font-medium">Filter Type</Label>
            <Select 
              value={emergencyOnly ? "emergency" : "all"} 
              onValueChange={(value) => handleEmergencyToggle(value === "emergency")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="emergency">Emergency Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Location Display */}
        {address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Searching near: {address}</span>
          </div>
        )}
      </div>

      {/* Radius Expansion Alert */}
      {expandedRadius && (
        <Alert>
          <Navigation2 className="h-4 w-4" />
          <AlertDescription>
            Expanded search radius to {radiusFilter}km to find more clinics in your area.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredClinics.length === 0 && clinics.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Hospital className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No clinics match your search</h3>
              <p className="text-sm">Try adjusting your search terms or filters</p>
            </div>
          )}

          {filteredClinics.length === 0 && clinics.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Hospital className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No clinics found</h3>
              <p className="text-sm">Try expanding your search radius or check your location</p>
            </div>
          )}

          {filteredClinics.map((clinic) => (
            <Card 
              key={clinic.id} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                clinic.is_emergency ? 'border-red-200 bg-red-50/50' : 'border-emerald-200 bg-emerald-50/50'
              }`}
              onClick={() => onClinicSelect?.(clinic)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Hospital className={`h-5 w-5 ${clinic.is_emergency ? 'text-red-600' : 'text-emerald-600'}`} />
                      {clinic.name}
                      {clinic.is_emergency && (
                        <Badge variant="destructive" className="text-xs">
                          Emergency
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {clinic.address}
                      {clinic.distance && (
                        <span className="ml-2 text-xs font-medium">
                          {clinic.distance}km away
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {clinic.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {clinic.rating}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{clinic.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{clinic.hours}</span>
                </div>

                {clinic.services.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {clinic.services.slice(0, 3).map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {clinic.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{clinic.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      callClinic(clinic.phone)
                    }}
                    className="flex-1"
                    variant="outline"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(getDirectionsUrl(clinic), '_blank')
                    }}
                    className={`flex-1 ${
                      clinic.is_emergency 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    <Navigation2 className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}