import { Task } from './Task.entity';
import { TaskGroup } from './TaskGroup.entity';

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

export const mapWorkPackageToAircraftTask = (workPackage: WorkPackage): Task => ({
  ...workPackage,
  type: 1,
});

export const addWorkPackagesToAircraftTaskGroups = (workPackages: WorkPackage[], taskGroups: TaskGroup[]) => {
  workPackages.forEach((workPackage) => {
    const groupName = workPackage.registration;
    const task = mapWorkPackageToAircraftTask(workPackage);
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
