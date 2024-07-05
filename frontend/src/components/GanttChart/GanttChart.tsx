import React, { useState } from 'react';
import TaskList from './TaskList';
import Timeline from './Timeline';
import styles from './GanttChart.module.scss';
import { TaskGroup } from '../../models/TaskGroup';
import { ResizableBox } from 'react-resizable';

interface GanttChartProps {
  taskGroups: TaskGroup[];
}

const GanttChart: React.FC<GanttChartProps> = ({ taskGroups }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(300);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResize = (_event: any, { size }: { size: { width: number; height: number } }) => {
    setLeftPanelWidth(size.width);
  };

  return (
    <div className={styles.ganttChart}>
      <ResizableBox
        width={leftPanelWidth}
        height={Infinity}
        resizeHandles={['e']}
        onResize={handleResize}
        minConstraints={[100, Infinity]}
        maxConstraints={[600, Infinity]}
        className={styles.leftPanel}
      >
        <TaskList taskGroups={taskGroups} onTaskGroupToggle={handleTaskGroupToggle} expandedGroups={expandedGroups} />
      </ResizableBox>
      <div className={styles.rightPanel}>
        <Timeline taskGroups={taskGroups} expandedGroups={expandedGroups} />
      </div>
    </div>
  );
};

export default GanttChart;
