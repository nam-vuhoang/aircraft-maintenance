import { Task } from "./Task.entity";

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

export const mapWorkPackageToTask = (workPackage: WorkPackage): Task => ({
  ...workPackage,
  type: 1,
});
