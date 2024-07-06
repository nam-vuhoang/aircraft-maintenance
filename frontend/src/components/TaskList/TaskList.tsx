import React from 'react';
import styles from './TaskList.module.scss';
import { TaskGroup } from '../../models/TaskGroup.entity';

interface TaskListProps {
  taskGroups: TaskGroup[];
  onTaskGroupToggle: (groupName: string) => void;
  expandedGroups: Set<string>;
}

const TaskList: React.FC<TaskListProps> = ({ taskGroups, onTaskGroupToggle, expandedGroups }) => {
  return (
    <div className={styles.taskList}>
      {taskGroups.map((group) => (
        <div key={group.name}>
          <div className={styles.taskGroup} onClick={() => onTaskGroupToggle(group.name)}>
            {group.name}
          </div>
          {expandedGroups.has(group.name) && (
            <div className={styles.taskItems}>
              {group.tasks.map((task) => (
                <div key={task.id} className={styles.taskItem}>
                  {task.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
