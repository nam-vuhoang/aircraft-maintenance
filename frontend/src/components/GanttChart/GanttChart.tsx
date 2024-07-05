import React, { useState } from 'react';
import TaskList from './TaskList';
import Timeline from './Timeline';
import TimeScale from './TimeScale';
import styles from './GanttChart.module.scss';
import { TaskGroup } from '../../models/TaskGroup';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface GanttChartProps {
  taskGroups: TaskGroup[];
}

type ZoomLevel = 'hours' | 'days' | 'months';

const GanttChart: React.FC<GanttChartProps> = ({ taskGroups }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(300);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('days');

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

  const handleResize = (event: any, { size }: { size: { width: number; height: number } }) => {
    setLeftPanelWidth(size.width);
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setZoomLevel(event.target.value as ZoomLevel);
  };

  const allTasks = taskGroups.flatMap((group) => group.tasks);
  const minDate = new Date(Math.min(...allTasks.map((task) => task.start.getTime())));
  const maxDate = new Date(Math.max(...allTasks.map((task) => task.end.getTime())));

  return (
    <div className={styles.ganttChart}>
      <div className={styles.zoomControl}>
        <label htmlFor="zoom">Zoom: </label>
        <select id="zoom" value={zoomLevel} onChange={handleZoomChange}>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="months">Months</option>
        </select>
      </div>
      <div className={styles.mainContainer}>
        <ResizableBox
          width={leftPanelWidth}
          height={Infinity}
          resizeHandles={['e']}
          onResize={handleResize}
          minConstraints={[100, Infinity]}
          maxConstraints={[600, Infinity]}
          className={styles.leftPanel}
        >
          <div className={styles.leftHeader}>
            <div>Name</div>
          </div>
          <TaskList taskGroups={taskGroups} onTaskGroupToggle={handleTaskGroupToggle} expandedGroups={expandedGroups} />
        </ResizableBox>
        <div className={styles.rightPanel}>
          <TimeScale minDate={minDate} maxDate={maxDate} zoomLevel={zoomLevel} />
          <Timeline taskGroups={taskGroups} expandedGroups={expandedGroups} zoomLevel={zoomLevel} />
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
