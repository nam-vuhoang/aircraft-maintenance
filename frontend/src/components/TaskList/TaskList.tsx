import React, { ReactNode } from 'react';
import styles from './TaskList.module.scss';
import { TaskGroup } from '../../models/TaskGroup.entity';
import { GanttChartTypeInfo } from '../GanttChart/GanttChart';
import { Box } from '@chakra-ui/react';
import InlineIcon from '../InlineIcon/InlineIcon';

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
            <Box display="flex" alignItems="center" justifyContent="space-between" position="relative">
              <Box flex={1}>
                <InlineIcon>{taskGroupIcon}</InlineIcon>
                <span>{group.name}</span>
              </Box>

              {/* <Box whiteSpace="nowrap"> */}
                {taskTypeCounts?.map((taskTypeCount) =>
                  taskTypeCount.counts
                    .filter((taskTypeCount) => taskTypeCount.groupName === group.name)
                    .map((count) => (
                      <span
                        key={taskTypeCount.info.typeIndex}
                        style={{
                          fontWeight: 'bold',
                          color: taskTypeCount.info.textColor,
                          width: '3em',
                          textAlign: 'right',
                        }}
                      >
                        {count.count}
                        <InlineIcon style={{marginLeft: '4px'}}>{taskTypeCount.info.icon}</InlineIcon>
                      </span>
                    ))
                )}
              {/* </Box> */}
            </Box>
          </div>
          {expandedGroups.has(group.name) && (
            <div className={styles.taskItems}>
              {group.tasks.map((task) => {
                const taskTypeInfo = taskTypeInfos?.find((info) => info.typeIndex === task.typeIndex);
                return (
                  <Box key={task.id} className={styles.taskItem} color={taskTypeInfo?.textColor}>
                    <InlineIcon>{taskTypeInfo?.icon}</InlineIcon> {task.name}
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
