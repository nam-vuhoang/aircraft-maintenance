/**
 * Work package entity.
 */
export interface WorkPackage {
  id: string;
  registration: string;
  name: string;
  station: string;
  status: string;
  area: string;
  startTime: Date;
  endTime: Date;
}
