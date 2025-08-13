const axios = require('axios');
const logger = require('../utils/logger');

class GeocodingService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  async geocodeAddress(address) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          address: address,
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK' || !response.data.results.length) {
        throw new Error('Address not found');
      }

      const result = response.data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        components: result.address_components
      };
    } catch (error) {
      logger.error('Geocoding error:', error);
      throw error;
    }
  }

  async reverseGeocode(lat, lng) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          latlng: `${lat},${lng}`,
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK' || !response.data.results.length) {
        throw new Error('Location not found');
      }

      const result = response.data.results[0];
      return {
        formattedAddress: result.formatted_address,
        components: result.address_components
      };
    } catch (error) {
      logger.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  async calculateDistance(origin, destination) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: `${origin.lat},${origin.lng}`,
          destinations: `${destination.lat},${destination.lng}`,
          units: 'metric',
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK' || 
          !response.data.rows.length || 
          response.data.rows[0].elements[0].status !== 'OK') {
        throw new Error('Unable to calculate distance');
      }

      const element = response.data.rows[0].elements[0];
      return {
        distance: element.distance.value, // in meters
        duration: element.duration.value, // in seconds
        distanceText: element.distance.text,
        durationText: element.duration.text
      };
    } catch (error) {
      logger.error('Distance calculation error:', error);
      throw error;
    }
  }

  calculateDeliveryFee(distanceInKm) {
    const baseRate = 5; // Base delivery fee
    const ratePerKm = 1.5; // Rate per kilometer
    const maxFee = 25; // Maximum delivery fee

    if (distanceInKm <= 2) {
      return baseRate;
    }

    const fee = baseRate + ((distanceInKm - 2) * ratePerKm);
    return Math.min(fee, maxFee);
  }
}

module.exports = new GeocodingService();