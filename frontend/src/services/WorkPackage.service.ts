import axios, { AxiosInstance } from 'axios';
import { WorkPackage } from '../models/WorkPackage.entity';
import { WorkPackageFilter } from '../models/WorkPackageFilter.dto';
import logger from '../logger';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

class WorkPackageService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  async getAllWorkPackages(): Promise<WorkPackage[]> {
    try {
      logger.debug('Fetching all work packages');
      const response = await this.axiosInstance.get<WorkPackage[]>('/work-packages');
      return response.data;
    } catch (error) {
      logger.error('Error fetching all work packages:', error);
      throw error;
    }
  }

  async getWorkPackageById(id: string): Promise<WorkPackage> {
    try {
      logger.debug(`Fetching work package with ID: ${id}`);
      const response = await this.axiosInstance.get<WorkPackage>(`/work-packages/${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching work package with ID ${id}:`, error);
      throw error;
    }
  }

  async createWorkPackage(workPackage: WorkPackage): Promise<WorkPackage> {
    try {
      logger.debug('Creating new work package:', workPackage);
      const response = await this.axiosInstance.post<WorkPackage>('/work-packages', workPackage);
      return response.data;
    } catch (error) {
      logger.error('Error creating new work package:', error);
      throw error;
    }
  }

  async updateWorkPackage(id: string, workPackage: WorkPackage): Promise<WorkPackage> {
    try {
      logger.debug(`Updating work package with ID ${id}:`, workPackage);
      const response = await this.axiosInstance.put<WorkPackage>(`/work-packages/${id}`, workPackage);
      return response.data;
    } catch (error) {
      logger.error(`Error updating work package with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteWorkPackage(id: string): Promise<void> {
    try {
      logger.debug(`Deleting work package with ID ${id}`);
      await this.axiosInstance.delete(`/work-packages/${id}`);
    } catch (error) {
      logger.error(`Error deleting work package with ID ${id}:`, error);
      throw error;
    }
  }

  async searchWorkPackages(filter: WorkPackageFilter): Promise<WorkPackage[]> {
    try {
      logger.debug('Searching work packages with filter:', filter);
      const response = await this.axiosInstance.post<WorkPackage[]>('/work-packages/search', filter);
      return response.data;
    } catch (error) {
      logger.error('Error searching work packages with filter:', error);
      throw error;
    }
  }

  async getCategoryValues(category: string): Promise<string[]> {
    try {
      logger.debug(`Fetching work package category values for ${category}`);
      const response = await this.axiosInstance.get<string[]>(`/work-packages/categories/${category}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching work package category values for ${category}:`, error);
      throw error;
    }
  }

  async importWorkPackages(workPackages: WorkPackage[]): Promise<{ imported: number }> {
    try {
      logger.debug('Importing work packages:', workPackages);
      const response = await this.axiosInstance.post<{ imported: number }>('/work-packages/import', workPackages);
      return response.data;
    } catch (error) {
      logger.error('Error importing work packages:', error);
      throw error;
    }
  }
}

export default new WorkPackageService();
