import { Task, TaskGroup } from ".";

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
