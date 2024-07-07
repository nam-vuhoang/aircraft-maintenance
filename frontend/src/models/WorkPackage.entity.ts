import { Task } from './Task.entity';
import { TaskGroup } from './TaskGroup.entity';

/**
 * Index of the work package type, used to differ colors in GanttCharts.
 */
export const WorkPackageTypeIndex = 1;

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

/**
 * Convert a work package to a task.
 * @param workPackage
 * @returns
 */
export const convertWorkPackageToTask = (workPackage: WorkPackage): Task => ({
  ...workPackage,
  typeIndex: WorkPackageTypeIndex,
});

/**
 * Add work packages to task groups.
 * @param workPackages
 * @param taskGroups
 */
export const addWorkPackagesToTaskGroups = (workPackages: WorkPackage[], taskGroups: TaskGroup[]) => {
  workPackages.forEach((workPackage) => {
    const groupName = workPackage.registration;
    const task = convertWorkPackageToTask(workPackage);
    const taskGroup = taskGroups.find((group) => group.name === groupName);
    if (taskGroup) {
      taskGroup.tasks.push(task);
    } else {
      taskGroups.push({
        name: groupName,
        tasks: [task],
      });
    }
  });
};
