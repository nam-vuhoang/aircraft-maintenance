import React from 'react';
import styles from './Timeline.module.scss';
import { TaskGroup } from '../../models/TaskGroup';

interface TimelineProps {
  taskGroups: TaskGroup[];
  expandedGroups: Set<string>;
}

const getTaskColor = (type: number) => {
  return type === 1 ? 'rgba(0, 123, 255, 0.5)' : 'rgba(255, 87, 51, 0.5)';
};

const Timeline: React.FC<TimelineProps> = ({ taskGroups, expandedGroups }) => {
  const allTasks = taskGroups.flatMap((group) => group.tasks);
  const minDate = new Date(Math.min(...allTasks.map((task) => task.start.getTime())));
  const maxDate = new Date(Math.max(...allTasks.map((task) => task.end.getTime())));
  const timeSpan = maxDate.getTime() - minDate.getTime();

  return (
    <div className={styles.timeline}>
      {taskGroups.map((group) => {
        const isExpanded = expandedGroups.has(group.name);
        return (
          <div key={group.name}>
            {isExpanded && <div className={styles.emptyRow}></div>}
            {group.tasks.map((task) => {
              const taskStartX = ((task.start.getTime() - minDate.getTime()) / timeSpan) * 100;
              const taskWidth = ((task.end.getTime() - task.start.getTime()) / timeSpan) * 100;
              const taskColor = getTaskColor(task.type);
              return (
                <>
                  <div
                    key={task.id}
                    className={styles.taskBar}
                    style={{
                      left: `${taskStartX}%`,
                      width: `${taskWidth}%`,
                      backgroundColor: taskColor,
                    }}
                  >
                    {task.name}
                  </div>
                  {isExpanded && <div className={styles.emptyRow}></div>}
                </>
              );
            })}
            {!isExpanded && <div className={styles.emptyRow}></div>}
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
