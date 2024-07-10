import axios, { AxiosInstance } from 'axios';
import logger from '../logger';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

class CategoryService {
  private axiosInstance: AxiosInstance;

  constructor() {
    logger.info(`API base URL: ${baseURL}`);
    if (!baseURL) {
      throw new Error('API base URL is not defined');
    }
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getFlightCategoryValues(category: string): Promise<string[]> {
    logger.debug(`Fetching flight category values for ${category}`);
    try {
      const response = await this.axiosInstance.get<string[]>(`/flights/categories/${category}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching flight category values for ${category}: ${error}`);
      throw error;
    }
  }

  async getWorkPackageCategoryValues(category: string): Promise<string[]> {
    logger.debug(`Fetching work package category values for ${category}`);
    try {
      const response = await this.axiosInstance.get<string[]>(`/work-packages/categories/${category}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching work package category values for ${category}: ${error}`);
      throw error;
    }
  }
}

export default new CategoryService();
