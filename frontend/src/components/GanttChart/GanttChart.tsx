import React, { useState } from 'react';
import TaskList from './TaskList';
import Timeline from './Timeline';
import styles from './GanttChart.module.scss';
import { TaskGroup } from '../models/TaskGroup';

interface GanttChartProps {
  taskGroups: TaskGroup[];
}

const GanttChart: React.FC<GanttChartProps> = ({ taskGroups }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const handleTaskGroupToggle = (groupName: string) => {
    setExpandedGroups((prevState) => {
      const newSet = new Set(prevState);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.ganttChart}>
      <div className={styles.leftPanel}>
        <TaskList taskGroups={taskGroups} onTaskGroupToggle={handleTaskGroupToggle} expandedGroups={expandedGroups} />
      </div>
      <div className={styles.rightPanel}>
        <Timeline taskGroups={taskGroups} expandedGroups={expandedGroups} />
      </div>
    </div>
  );
};

export default GanttChart;
