export interface LocationCoordinates {
  latitude: number
  longitude: number
}

export interface LocationError {
  code: number
  message: string
}

export class LocationService {
  static async getCurrentPosition(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser.'
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          let message = 'An unknown error occurred.'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user.'
              break
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.'
              break
            case error.TIMEOUT:
              message = 'Location request timed out.'
              break
          }
          reject({
            code: error.code,
            message
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  static async geocodeAddress(address: string): Promise<LocationCoordinates> {
    // For demo purposes, return mock coordinates
    // In production, this would use a geocoding service like Google Maps API
    const mockCoordinates: Record<string, LocationCoordinates> = {
      'lagos': { latitude: 6.5244, longitude: 3.3792 },
      'abuja': { latitude: 9.0765, longitude: 7.3986 },
      'kano': { latitude: 12.0022, longitude: 8.5920 },
      'port harcourt': { latitude: 4.8156, longitude: 7.0498 },
      'ibadan': { latitude: 7.3775, longitude: 3.9470 },
      'enugu': { latitude: 6.5244, longitude: 7.5112 },
      'nsukka': { latitude: 6.8567, longitude: 7.3958 },
      'awka': { latitude: 6.2107, longitude: 7.0719 },
      'onitsha': { latitude: 6.1667, longitude: 6.7833 },
      'aba': { latitude: 5.1066, longitude: 7.3667 },
      'umuahia': { latitude: 5.5251, longitude: 7.4951 },
      'owerri': { latitude: 5.4840, longitude: 7.0351 },
      'abakaliki': { latitude: 6.3248, longitude: 8.1137 },
      'agbor': { latitude: 6.2570, longitude: 6.1914 },
      'asaba': { latitude: 6.1951, longitude: 6.6999 }
    }

    const normalizedAddress = address.toLowerCase()
    for (const [city, coords] of Object.entries(mockCoordinates)) {
      if (normalizedAddress.includes(city)) {
        return coords
      }
    }

    // Default to Lagos if no match found
    return mockCoordinates.lagos
  }

  static calculateDistance(
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