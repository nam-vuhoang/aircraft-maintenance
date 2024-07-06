import axios, { AxiosInstance } from 'axios';
import { WorkPackage } from '../models/WorkPackage.entity';
import { WorkPackageFilter } from '../models/WorkPackageFilter.dto';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

class WorkPackageService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  async getAllWorkPackages(): Promise<WorkPackage[]> {
    const response = await this.axiosInstance.get<WorkPackage[]>('/work-packages');
    return response.data;
  }

  async getWorkPackageById(id: string): Promise<WorkPackage> {
    const response = await this.axiosInstance.get<WorkPackage>(`/work-packages/${id}`);
    return response.data;
  }

  async createWorkPackage(workPackage: WorkPackage): Promise<WorkPackage> {
    const response = await this.axiosInstance.post<WorkPackage>('/work-packages', workPackage);
    return response.data;
  }

  async updateWorkPackage(id: string, workPackage: WorkPackage): Promise<WorkPackage> {
    const response = await this.axiosInstance.put<WorkPackage>(`/work-packages/${id}`, workPackage);
    return response.data;
  }

  async deleteWorkPackage(id: string): Promise<void> {
    await this.axiosInstance.delete(`/work-packages/${id}`);
  }

  async searchWorkPackages(filter: WorkPackageFilter): Promise<WorkPackage[]> {
    const response = await this.axiosInstance.post<WorkPackage[]>('/work-packages/search', filter);
    return response.data;
  }

  async getCategoryValues(category: string): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>(`/work-packages/categories/${category}`);
    return response.data;
  }

  async importWorkPackages(workPackages: WorkPackage[]): Promise<{ imported: number }> {
    const response = await this.axiosInstance.post<{ imported: number }>('/work-packages/import', workPackages);
    return response.data;
  }
}

export default new WorkPackageService();
