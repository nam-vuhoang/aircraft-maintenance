import React, { useState } from 'react';
import TaskList from './TaskList';
import Timeline from './Timeline';
import styles from './GanttChart.module.scss';
import { TaskGroup } from '../../models/TaskGroup';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { TimeScaleFormat } from '../TimeRuler/TimeRuler';

interface GanttChartProps {
  taskGroups: TaskGroup[];
}

interface ZoomLevel {
  name: string;
  description: string;
  scaleFormats: TimeScaleFormat[];
}

const zoomLevels: ZoomLevel[] = [
  {
    name: 'Hours',
    description: 'Days + Hours',
    scaleFormats: [
      { unit: 'day', format: 'DD MMM' },
      { unit: 'hour', format: 'HH' },
    ],
  },
  {
    name: 'Hours-3',
    description: 'Days + 3 Hours',
    scaleFormats: [
      { unit: 'day', format: 'DD MMM' },
      { unit: 'hour', format: 'HH' },
    ],
  },
  {
    name: 'Hours-6',
    description: 'Days + 6 Hours',
    scaleFormats: [
      { unit: 'day', format: 'DD MMM' },
      { unit: 'hour-3', format: 'HH' },
    ],
  },
  {
    name: 'Days',
    description: 'Weeks + Days',
    scaleFormats: [
      { unit: 'week', format: '[Week ]w' },
      { unit: 'day', format: 'DD' },
    ],
  },
  {
    name: 'Weeks',
    description: 'Months + Weeks',
    scaleFormats: [
      { unit: 'month', format: 'MMMM yyyy' },
      { unit: 'week', format: '[W]w' },
    ],
  },
];

const defaultZoomLevel = 'Days';

const GanttChart: React.FC<GanttChartProps> = ({ taskGroups }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(300);
  const [zoomLevelName, setZoomLevelName] = useState<string>(defaultZoomLevel);

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

  const handleResize = (_event: any, { size }: { size: { width: number; height: number } }) => {
    setLeftPanelWidth(size.width);
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setZoomLevelName(event.target.value);
  };

  const allTasks = taskGroups.flatMap((group) => group.tasks);
  const minTime = new Date(Math.min(...allTasks.map((task) => task.start.getTime())));
  const maxTime = new Date(Math.max(...allTasks.map((task) => task.end.getTime())));
  const timeRulers = zoomLevels.find((level) => level.name === zoomLevelName)?.scaleFormats || [];
  const timeUnit = timeRulers[timeRulers.length - 1].unit;

  return (
    <div className={styles.ganttChart}>
      <div className={styles.zoomControl}>
        <label htmlFor="zoom">Zoom: </label>
        <select id="zoom" value={zoomLevelName} onChange={handleZoomChange}>
          {zoomLevels.map((level, index) => (
            <option key={index} value={level.name}>
              {level.description}
            </option>
          ))}
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
          <>
            <div className={styles.leftHeader}>
              <div>Name</div>
            </div>
            <TaskList
              taskGroups={taskGroups}
              onTaskGroupToggle={handleTaskGroupToggle}
              expandedGroups={expandedGroups}
            />
          </>
        </ResizableBox>
        <div className={styles.rightPanel}>
          <TimeRuler minTime={minTime} maxTime={maxTime} scaleFormats={timeRulers} />
          {/* <Timeline taskGroups={taskGroups} expandedGroups={expandedGroups} timeUnit={timeUnit} /> */}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
