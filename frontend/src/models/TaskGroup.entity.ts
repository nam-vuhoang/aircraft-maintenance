import { Task } from './Task.entity';

/**
 * Task group entity, used for grouping tasks in the GanttChart.
 */
export interface TaskGroup {
  name: string;
  tasks: Task[];
}
