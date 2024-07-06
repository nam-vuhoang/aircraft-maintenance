import { Task } from './Task.entity';

export interface TaskGroup {
  name: string;
  tasks: Task[];
}
