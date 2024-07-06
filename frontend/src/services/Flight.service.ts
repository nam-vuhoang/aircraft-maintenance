import axios, { AxiosInstance } from 'axios';
import { Flight } from '../models/Flight.entity';
import { FlightFilter } from '../models/FlightFilter.dto';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

class FlightService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL,
    });
    console.log('API_BASE_URL:', baseURL);
  }

  async getAllFlights(): Promise<Flight[]> {
    const response = await this.axiosInstance.get<Flight[]>('/flights');
    return response.data;
  }

  async getFlightById(id: string): Promise<Flight> {
    const response = await this.axiosInstance.get<Flight>(`/flights/${id}`);
    return response.data;
  }

  async createFlight(flight: Flight): Promise<Flight> {
    const response = await this.axiosInstance.post<Flight>('/flights', flight);
    return response.data;
  }

  async updateFlight(id: string, flight: Flight): Promise<Flight> {
    const response = await this.axiosInstance.put<Flight>(`/flights/${id}`, flight);
    return response.data;
  }

  async deleteFlight(id: string): Promise<void> {
    await this.axiosInstance.delete(`/flights/${id}`);
  }

  async searchFlights(filter: FlightFilter): Promise<Flight[]> {
    const response = await this.axiosInstance.post<Flight[]>('/flights/search', filter);
    return response.data;
  }

  async getCategoryValues(category: string): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>(`/flights/categories/${category}`);
    return response.data;
  }

  async importFlights(flights: Flight[]): Promise<{ imported: number }> {
    const response = await this.axiosInstance.post<{ imported: number }>('/flights/import', flights);
    return response.data;
  }
}

export default new FlightService();
