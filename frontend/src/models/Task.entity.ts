/**
 * Task entity, used for representing tasks in the GanttChart.
 */
export interface Task {
  typeIndex: number; // 0: Flight, 1: WorkPackage
  id: string | number;
  name: string;
  startTime: Date;
  endTime: Date;
  startName?: string;
  endName?: string;
}
