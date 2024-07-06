import React, { useState, useEffect, useRef } from 'react';
import TaskList from './TaskList';
import styles from './GanttChart.module.scss';
import { TaskGroup } from '../../models/TaskGroup';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import TimeRuler from '../TimeRuler/TimeRuler';
import { getMillisecondsInTimeUnit, roundDown, roundUp, TimeUnit } from '../../utils/TimeUtils';
import Timeline from './Timeline';

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
  const [minTime, setMinTime] = useState<Date>(new Date());
  const [maxTime, setMaxTime] = useState<Date>(new Date());
  const [units, setUnits] = useState<TimeUnit[]>([]);
  const [millisecondWidth, setMillisecondWidth] = useState<number>(0);

  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (rightPanelRef.current) {
        const containerWidth = rightPanelRef.current.offsetWidth;
        const units = zoomLevels.find((level) => level.name === zoomLevelName)?.units || [];

        const lowestUnit = units[units.length - 1];
        const lowestUnitDuration = getMillisecondsInTimeUnit(lowestUnit);

        const allTasks = taskGroups.flatMap((group) => group.tasks);
        const minTime = new Date(Math.min(...allTasks.map((task) => task.start.getTime())));
        const maxTime = new Date(Math.max(...allTasks.map((task) => task.end.getTime())));
        const roundedMinTime = roundDown(minTime, lowestUnit);
        const roundedMaxTime = roundUp(maxTime, lowestUnit);
        const totalDuration = roundedMaxTime.getTime() - roundedMinTime.getTime();

        const lowestUnitWidth = Math.max(25, Math.round((containerWidth * lowestUnitDuration) / totalDuration));
        setMinTime(roundedMinTime);
        setMaxTime(roundedMaxTime);
        setUnits(units);
        setMillisecondWidth(lowestUnitWidth / lowestUnitDuration);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [taskGroups, zoomLevelName]);

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
        <div className={styles.rightPanel} ref={rightPanelRef}>
          <TimeRuler minTime={minTime} maxTime={maxTime} units={units} millisecondWidth={millisecondWidth} />
          <Timeline
            taskGroups={taskGroups}
            expandedGroups={expandedGroups}
            minTime={minTime}
            maxTime={maxTime}
            units={units}
            millisecondWidth={millisecondWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
