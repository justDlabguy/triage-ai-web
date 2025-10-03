"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, AlertCircle } from "lucide-react"
import { LocationService, LocationCoordinates, LocationError } from "@/lib/location"

interface LocationFormProps {
  onLocationSelected: (location: LocationCoordinates, address?: string) => void
  className?: string
}

const NIGERIAN_CITIES = [
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "kano", label: "Kano" },
  { value: "port harcourt", label: "Port Harcourt" },
  { value: "ibadan", label: "Ibadan" },
  { value: "enugu", label: "Enugu" },
  { value: "nsukka", label: "Nsukka, Enugu" },
  { value: "awka", label: "Awka, Anambra" },
  { value: "onitsha", label: "Onitsha, Anambra" },
  { value: "aba", label: "Aba, Abia" },
  { value: "umuahia", label: "Umuahia, Abia" },
  { value: "owerri", label: "Owerri, Imo" },
  { value: "abakaliki", label: "Abakaliki, Ebonyi" },
  { value: "agbor", label: "Agbor, Delta" },
  { value: "asaba", label: "Asaba, Delta" },
  { value: "benin city", label: "Benin City" },
  { value: "kaduna", label: "Kaduna" },
  { value: "jos", label: "Jos" },
  { value: "ilorin", label: "Ilorin" }
]

export function LocationForm({ onLocationSelected, className }: LocationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [manualAddress, setManualAddress] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const handleAutoDetect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const coordinates = await LocationService.getCurrentPosition()
      onLocationSelected(coordinates, "Current Location")
    } catch (err) {
      const locationError = err as LocationError
      if (locationError.code === 1) {
        setShowPermissionDialog(true)
      } else {
        setError(locationError.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSubmit = async () => {
    if (!manualAddress.trim() && !selectedCity) {
      setError("Please enter an address or select a city")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const address = selectedCity || manualAddress
      const coordinates = await LocationService.geocodeAddress(address)
      onLocationSelected(coordinates, address)
    } catch {
      setError("Unable to find location. Please try a different address.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setManualAddress("")
    setError(null)
  }

  const handleAddressChange = (value: string) => {
    setManualAddress(value)
    setSelectedCity("")
    setError(null)
  }

  return (
    <>
      <div className={className}>
        <div className="space-y-4">
          {/* Auto-detect location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Automatic Detection</Label>
            <Button
              onClick={handleAutoDetect}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Detecting location...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Use My Current Location
                </div>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Manual location input */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Manual Entry</Label>
            
            {/* City selector */}
            <div className="space-y-2">
              <Label htmlFor="city-select" className="text-xs text-muted-foreground">
                Select a city
              </Label>
              <Select value={selectedCity} onValueChange={handleCitySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a Nigerian city" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Address input */}
            <div className="space-y-2">
              <Label htmlFor="address-input" className="text-xs text-muted-foreground">
                Or enter a specific address
              </Label>
              <Input
                id="address-input"
                placeholder="Enter street address, landmark, or area"
                value={manualAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleManualSubmit}
              disabled={isLoading || (!manualAddress.trim() && !selectedCity)}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  Finding location...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Find Clinics Near This Location
                </div>
              )}
            </Button>
          </div>

          {/* Error display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Permission dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Location Permission Required
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                To find clinics near you, we need access to your location. This helps us:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Show nearby emergency clinics</li>
                <li>Calculate accurate distances</li>
                <li>Provide better recommendations</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Your location data is only used for finding nearby healthcare facilities and is not stored or shared.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowPermissionDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              setShowPermissionDialog(false)
              handleAutoDetect()
            }}>
              Allow Location Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}