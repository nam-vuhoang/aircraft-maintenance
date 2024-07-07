import React, { ReactNode } from 'react';
import styles from './TaskList.module.scss';
import { TaskGroup } from '../../models/TaskGroup.entity';
import { GanttChartTypeInfo } from '../GanttChart/GanttChart';
import { Box } from '@chakra-ui/react';

interface TaskListProps {
  taskGroups: TaskGroup[];
  onTaskGroupToggle: (groupName: string) => void;
  expandedGroups: Set<string>;

  taskGroupCaption?: ReactNode;
  taskGroupIcon?: ReactNode;
  taskTypeInfos?: GanttChartTypeInfo[];
}

const TaskList: React.FC<TaskListProps> = ({
  taskGroups,
  onTaskGroupToggle,
  expandedGroups,
  taskGroupIcon,
  taskTypeInfos,
}) => {
  const taskTypeCounts = taskTypeInfos?.map((info) => ({
    info,
    counts: taskGroups.map((group) => ({
      groupName: group.name,
      count: group.tasks.filter((task) => task.typeIndex === info.typeIndex).length,
    })),
  }));

  return (
    <div className={styles.taskList}>
      {taskGroups.map((group) => (
        <div key={group.name}>
          <div className={styles.taskGroup} onClick={() => onTaskGroupToggle(group.name)}>
            <Box display="flex" alignItems="center">
              {taskGroupIcon}&nbsp;
              <span>{group.name}</span>
              {taskTypeCounts?.map((taskTypeCount) =>
                taskTypeCount.counts
                  .filter((taskTypeCount) => taskTypeCount.groupName === group.name)
                  .map((count) => (
                    <span
                      key={taskTypeCount.info.typeIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        color: taskTypeCount.info.textColor,
                      }}
                    >
                      &nbsp;{taskTypeCount.info.icon}
                      {count.count}
                    </span>
                  ))
              )}
            </Box>
          </div>
          {expandedGroups.has(group.name) && (
            <div className={styles.taskItems}>
              {group.tasks.map((task) => {
                const taskTypeInfo = taskTypeInfos?.find((info) => info.typeIndex === task.typeIndex);
                return (
                  <Box key={task.id} className={styles.taskItem} color={taskTypeInfo?.textColor}>
                    {taskTypeInfo?.icon} {task.name}
                  </Box>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
