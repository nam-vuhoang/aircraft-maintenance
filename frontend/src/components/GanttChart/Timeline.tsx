import React from 'react';
import styles from './Timeline.module.scss';
import { TaskGroup } from '../../models/TaskGroup';

interface TimelineProps {
  taskGroups: TaskGroup[];
  expandedGroups: Set<string>;
  zoomLevel: 'hours' | 'days' | 'months';
}

const getTaskColor = (type: number) => {
  return type === 1 ? 'rgba(0, 123, 255, 0.5)' : 'rgba(255, 87, 51, 0.5)';
};

const Timeline: React.FC<TimelineProps> = ({ taskGroups, expandedGroups, zoomLevel }) => {
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
              let taskStartX, taskWidth;

              if (zoomLevel === 'hours') {
                taskStartX = ((task.start.getTime() - minDate.getTime()) / timeSpan) * 100;
                taskWidth = ((task.end.getTime() - task.start.getTime()) / timeSpan) * 100;
              } else if (zoomLevel === 'days') {
                const startDays = (task.start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
                const endDays = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);
                taskStartX = (startDays / (timeSpan / (1000 * 60 * 60 * 24))) * 100;
                taskWidth = (endDays / (timeSpan / (1000 * 60 * 60 * 24))) * 100;
              } else {
                const startMonths =
                  (task.start.getFullYear() - minDate.getFullYear()) * 12 +
                  (task.start.getMonth() - minDate.getMonth());
                const endMonths =
                  (task.end.getFullYear() - task.start.getFullYear()) * 12 +
                  (task.end.getMonth() - task.start.getMonth());
                taskStartX = (startMonths / (timeSpan / (1000 * 60 * 60 * 24 * 30))) * 100;
                taskWidth = (endMonths / (timeSpan / (1000 * 60 * 60 * 24 * 30))) * 100;
              }

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
                    title={`${task.name}: ${task.start.toLocaleString()} - ${task.end.toLocaleString()}`}
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
