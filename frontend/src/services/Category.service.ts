import axios, { AxiosInstance } from 'axios';
// import { setupCache } from 'axios-cache-adapter';
import logger from '../logger';

// const cache = setupCache({
//   maxAge: 5 * 60 * 1000, // 5 minutes
// });

class CategoryService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      // adapter: cache.adapter,
      baseURL: import.meta.env.VITE_API_BASE_URL as string,
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
