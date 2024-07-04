import { GanttModel } from '../models/GanttModel';

export const fetchGanttData = async () => {
  // Replace with actual API call
  const data = await GanttModel.getData();
  return data;
};
