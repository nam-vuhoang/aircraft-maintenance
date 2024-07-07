import { compareTasks, Task } from './Task.entity';

/**
 * Task group entity, used for grouping tasks in the GanttChart.
 */
export interface TaskGroup {
  name: string;
  tasks: Task[];
}

/**
 * Compare two task groups by their name.
 * @param a
 * @param b
 * @returns
 */
export const compareTaskGroups = (a: TaskGroup, b: TaskGroup): number => a.name.localeCompare(b.name);

/**
 * Sort task groups (by name) and their tasks (by start time, end time, and name).
 * @param taskGroups
 * @returns
 */
export const sortTaskGroups = (taskGroups: TaskGroup[]): TaskGroup[] => {
  taskGroups.forEach((group) => {
    group.tasks.sort(compareTasks);
  });
  return taskGroups.sort(compareTaskGroups);
};
