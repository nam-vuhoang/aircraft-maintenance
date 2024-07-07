import axios, { AxiosInstance } from 'axios';
import logger from '../logger';
import { Flight, FlightFilter } from '../models';
import { convertFlightDtoToFlight, FlightDto } from './Flight.dto';

class FlightService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL as string,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getAllFlights(): Promise<Flight[]> {
    try {
      logger.debug('Fetching all flights');
      const response = await this.axiosInstance.get<FlightDto[]>('/flights');
      return response.data.map(convertFlightDtoToFlight);
    } catch (error) {
      logger.error('Error fetching all flights:', error);
      throw error;
    }
  }

  async getFlightById(id: string): Promise<Flight> {
    try {
      logger.debug(`Fetching flight with ID: ${id}`);
      const response = await this.axiosInstance.get<FlightDto>(`/flights/${id}`);
      return convertFlightDtoToFlight(response.data);
    } catch (error) {
      logger.error(`Error fetching flight with ID ${id}:`, error);
      throw error;
    }
  }

  async createFlight(flight: Flight): Promise<Flight> {
    try {
      logger.debug('Creating new flight:', flight);
      const response = await this.axiosInstance.post<FlightDto>('/flights', flight);
      return convertFlightDtoToFlight(response.data);
    } catch (error) {
      logger.error('Error creating new flight:', error);
      throw error;
    }
  }

  async updateFlight(id: string, flight: Flight): Promise<Flight> {
    try {
      logger.debug(`Updating flight with ID ${id}:`, flight);
      const response = await this.axiosInstance.put<FlightDto>(`/flights/${id}`, flight);
      return convertFlightDtoToFlight(response.data);
    } catch (error) {
      logger.error(`Error updating flight with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteFlight(id: string): Promise<void> {
    try {
      logger.debug(`Deleting flight with ID ${id}`);
      await this.axiosInstance.delete(`/flights/${id}`);
    } catch (error) {
      logger.error(`Error deleting flight with ID ${id}:`, error);
      throw error;
    }
  }

  async searchFlights(filter: FlightFilter): Promise<Flight[]> {
    try {
      logger.debug('Searching flights with filter:', filter);
      const response = await this.axiosInstance.post<FlightDto[]>('/flights/search', filter);
      return response.data.map(convertFlightDtoToFlight);
    } catch (error) {
      logger.error('Error searching flights with filter:', error);
      throw error;
    }
  }

  async getCategoryValues(category: string): Promise<string[]> {
    try {
      logger.debug(`Fetching flight category values for ${category}`);
      const response = await this.axiosInstance.get<string[]>(`/flights/categories/${category}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching flight category values for ${category}:`, error);
      throw error;
    }
  }

  async importFlights(flights: Flight[]): Promise<{ imported: number }> {
    try {
      logger.debug('Importing flights:', flights);
      const response = await this.axiosInstance.post<{ imported: number }>('/flights/import', flights);
      return response.data;
    } catch (error) {
      logger.error('Error importing flights:', error);
      throw error;
    }
  }
}

export default new FlightService();
