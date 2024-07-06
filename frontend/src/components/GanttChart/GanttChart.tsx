import React, { useState, useEffect, useCallback } from 'react';
import TaskList from './TaskList';
import styles from './GanttChart.module.scss';
import { TaskGroup } from '../../models/TaskGroup';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import TimeRuler, { TimeRulerState } from '../TimeRuler/TimeRuler';
import { TimeUnit } from '../../utils/TimeUtils';
import Timeline from './Timeline';

// Type definition for TimeRulerState
interface GanttChartProps {
  taskGroups: TaskGroup[];
}

interface ZoomLevel {
  name: string;
  units: TimeUnit[];
}

const zoomLevels: ZoomLevel[] = [
  {
    name: 'Days + Hours',
    units: ['day', 'hour'],
  },
  {
    name: 'Days + 3 Hours',
    units: ['day', 'hour-3'],
  },
  {
    name: 'Days + 6 Hours',
    units: ['day', 'hour-6'],
  },
  {
    name: 'Weeks + Days',
    units: ['week', 'day'],
  },
  {
    name: 'Weeks + Days + Hours',
    units: ['week', 'day', 'hour-3'],
  },
  {
    name: 'Months + Weeks + Days',
    units: ['month', 'week', 'day'],
  },
];

const GanttChart: React.FC<GanttChartProps> = ({ taskGroups }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(300);
  const [zoomLevelName, setZoomLevelName] = useState<string>(zoomLevels[3].name);
  const [timeRulerState, setTimeRulerState] = useState<TimeRulerState>({
    minTime: new Date(),
    maxTime: new Date(),
    units: [],
    millisecondWidth: 0,
  });

  // Added useEffect to set initial minTime and maxTime based on taskGroups
  useEffect(() => {
    const allTasks = taskGroups.flatMap((group) => group.tasks);
    const minTime = new Date(Math.min(...allTasks.map((task) => task.start.getTime())));
    const maxTime = new Date(Math.max(...allTasks.map((task) => task.end.getTime())));

    setTimeRulerState((prevState) => ({
      ...prevState,
      minTime,
      maxTime,
    }));
  }, [taskGroups]);

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

  const timeUnits = zoomLevels.find((level) => level.name === zoomLevelName)?.units || [];

  // Using useCallback to memoize the function to prevent unnecessary re-renders
  const handleStateChange = useCallback((state: TimeRulerState) => {
    setTimeRulerState((prevState) => {
      if (
        prevState.minTime.getTime() !== state.minTime.getTime() ||
        prevState.maxTime.getTime() !== state.maxTime.getTime() ||
        prevState.millisecondWidth !== state.millisecondWidth
      ) {
        return state;
      }
      return prevState;
    });
  }, []);

  return (
    <div className={styles.ganttChart}>
      <div className={styles.zoomControl}>
        <label htmlFor="zoom">Zoom: </label>
        <select id="zoom" value={zoomLevelName} onChange={handleZoomChange}>
          {zoomLevels.map((level, index) => (
            <option key={index} value={level.name}>
              {level.name}
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
          <TimeRuler
            minTime={timeRulerState.minTime}
            maxTime={timeRulerState.maxTime}
            units={timeUnits}
            onStateChange={handleStateChange}
          />
          {/* <Timeline taskGroups={taskGroups} expandedGroups={expandedGroups} timeRulerState={timeRulerState} /> */}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
