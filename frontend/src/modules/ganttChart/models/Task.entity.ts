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

/**
 * Compare two tasks by their start time, end time, and name.
 * @param a
 * @param b
 * @returns
 */
export const compareTasks = (a: Task, b: Task): number => {
  if (a.startTime < b.startTime) {
    return -1;
  } else if (a.startTime > b.startTime) {
    return 1;
  } else {
    if (a.endTime < b.endTime) {
      return -1;
    } else if (a.endTime > b.endTime) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  }
};
