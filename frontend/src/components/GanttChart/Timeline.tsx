import React from 'react';
import styles from './Timeline.module.scss';
import { TaskGroup } from '../../models/TaskGroup';
import { TimeRulerState } from '../TimeRuler/TimeRuler';

interface TimelineProps {
  taskGroups: TaskGroup[];
  expandedGroups: Set<string>;
  timeRulerState: TimeRulerState;
}

const getTaskColor = (type: number) => {
  return type === 1 ? 'rgba(0, 123, 255, 0.5)' : 'rgba(255, 87, 51, 0.5)';
};

const Timeline: React.FC<TimelineProps> = ({ taskGroups, expandedGroups, timeRulerState }) => {
  const { minTime, maxTime, lowestUnitWidth } = timeRulerState;

  // Calculate the total span of the timeline in milliseconds
  const timeSpan = maxTime.getTime() - minTime.getTime();

  return (
    <div className={styles.timeline}>
      {taskGroups.map((group) => {
        const isExpanded = expandedGroups.has(group.name);
        return (
          <div key={group.name}>
            {isExpanded && <div className={styles.emptyRow}></div>}
            {group.tasks.map((task) => {
              // Calculate taskStartX and taskWidth in terms of percentage
              const taskStartX = ((task.start.getTime() - minTime.getTime()) / timeSpan) * 100;
              const taskWidth = ((task.end.getTime() - task.start.getTime()) / timeSpan) * 100;

              console.log('task', {
                start: task.start,
                end: task.end,
                timeSpan: task.start.getTime() - minTime.getTime(),
                taskStartX,
                taskWidth,
                lowestUnitWidth,
              });

              const taskColor = getTaskColor(task.type);
              return (
                <React.Fragment key={task.id}>
                  <div
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
                </React.Fragment>
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
