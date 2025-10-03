

export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  latitude: number
  longitude: number
  distance?: number
  is_emergency: boolean
  hours: string
  services: string[]
  rating?: number
}

export interface ClinicSearchParams {
  latitude: number
  longitude: number
  radius?: number
  emergency_only?: boolean
}

export class ClinicService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  static async searchClinics(params: ClinicSearchParams): Promise<Clinic[]> {
    try {
      const queryParams = new URLSearchParams({
        lat: params.latitude.toString(),
        lng: params.longitude.toString(),
        radius: (params.radius || 10).toString(),
        ...(params.emergency_only && { emergency_only: 'true' })
      })

      const response = await fetch(`${this.BASE_URL}/api/v1/clinics/emergency?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.clinics || []
    } catch (error) {
      console.error('Error fetching clinics:', error)
      // Return mock data for demo purposes
      return this.getMockClinics(params)
    }
  }

  private static getMockClinics(params: ClinicSearchParams): Clinic[] {
    const mockClinics: Clinic[] = [
      {
        id: "1",
        name: "Lagos University Teaching Hospital",
        address: "Idi-Araba, Surulere, Lagos",
        phone: "+234 1 234 5678",
        latitude: 6.5244,
        longitude: 3.3792,
        is_emergency: true,
        hours: "24/7 Emergency Services",
        services: ["Emergency Care", "Surgery", "ICU", "Cardiology"],
        rating: 4.2
      },
      {
        id: "2",
        name: "National Hospital Abuja",
        address: "Central Business District, Abuja",
        phone: "+234 9 876 5432",
        latitude: 9.0765,
        longitude: 7.3986,
        is_emergency: true,
        hours: "24/7 Emergency Services",
        services: ["Emergency Care", "Trauma Center", "Pediatrics"],
        rating: 4.5
      },
      {
        id: "3",
        name: "University of Nigeria Teaching Hospital",
        address: "Ituku-Ozalla, Enugu",
        phone: "+234 42 123 4567",
        latitude: 6.5244,
        longitude: 7.5112,
        is_emergency: true,
        hours: "24/7 Emergency Services",
        services: ["Emergency Care", "Surgery", "Maternity", "Oncology"],
        rating: 4.1
      },
      {
        id: "4",
        name: "Enugu State University Teaching Hospital",
        address: "Park Lane, Enugu",
        phone: "+234 42 987 6543",
        latitude: 6.4414,
        longitude: 7.4989,
        is_emergency: true,
        hours: "24/7 Emergency Services",
        services: ["Emergency Care", "Internal Medicine", "Orthopedics"],
        rating: 3.9
      },
      {
        id: "5",
        name: "Nsukka General Hospital",
        address: "University Road, Nsukka, Enugu",
        phone: "+234 42 771 2345",
        latitude: 6.8567,
        longitude: 7.3958,
        is_emergency: true,
        hours: "24/7 Emergency Services",
        services: ["Emergency Care", "General Medicine", "Pediatrics"],
        rating: 3.7
      },
      {
        id: "6",
        name: "Memfys Hospital for Women",
        address: "Independence Layout, Enugu",
        phone: "+234 42 456 7890",
        latitude: 6.4531,
        longitude: 7.5248,
        is_emergency: false,
        hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
        services: ["Maternity", "Gynecology", "Pediatrics"],
        rating: 4.3
      }
    ]

    // Calculate distances and filter by radius
    const clinicsWithDistance = mockClinics.map(clinic => ({
      ...clinic,
      distance: this.calculateDistance(
        params.latitude,
        params.longitude,
        clinic.latitude,
        clinic.longitude
      )
    }))

    // Filter by radius and emergency status
    let filteredClinics = clinicsWithDistance.filter(clinic => 
      clinic.distance! <= (params.radius || 10)
    )

    if (params.emergency_only) {
      filteredClinics = filteredClinics.filter(clinic => clinic.is_emergency)
    }

    // Sort by distance
    return filteredClinics.sort((a, b) => a.distance! - b.distance!)
  }

  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in kilometers
    return Math.round(d * 10) / 10 // Round to 1 decimal place
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}