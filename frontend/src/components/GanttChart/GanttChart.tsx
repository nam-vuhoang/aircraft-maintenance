import React, { useState, useEffect, useRef, ReactNode } from 'react';
import TaskList from '../TaskList/TaskList';
import styles from './GanttChart.module.scss';
import { TaskGroup } from '../../models/TaskGroup.entity';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import TimeRuler from '../TimeRuler/TimeRuler';
import { getMillisecondsInTimeUnit, roundDown, roundUp, TimeUnit } from '../../utils/TimeUtils';
import Timeline from '../Timeline/Timeline';
import InlineIcon from '../InlineIcon/InlineIcon';
import {
  ChakraProvider,
  Box,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Flex,
} from '@chakra-ui/react';

export interface GanttChartTypeInfo {
  typeIndex: number;
  caption: ReactNode;
  icon?: ReactNode;
  barColor?: string;
  textColor?: string;
}

interface GanttChartProps {
  taskGroups: TaskGroup[];

  taskGroupIcon?: ReactNode;
  taskGroupCaption?: ReactNode;

  taskTypeInfos?: GanttChartTypeInfo[];
}

interface ZoomLevel {
  name: string;
  units: TimeUnit[];
  isDefault?: boolean;
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
    units: ['week', 'day', 'hour'],
    isDefault: true,
  },
  {
    name: 'Weeks + Days + 3 Hours',
    units: ['week', 'day', 'hour-3'],
  },
  {
    name: 'Months + Weeks + Days',
    units: ['month', 'week', 'day'],
  },
  {
    name: 'Months + Days + 3 Hours',
    units: ['month', 'day', 'hour-3'],
  },
];

const defaultLowestUnitWidth = 25; // This is the default width of the lowest unit in pixels

const GanttChart: React.FC<GanttChartProps> = ({ taskGroups, taskGroupCaption, taskGroupIcon, taskTypeInfos }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(250);
  const [zoomLevelName, setZoomLevelName] = useState<string>(
    zoomLevels.find((level) => level.isDefault)?.name || zoomLevels[0].name
  );
  const [minTime, setMinTime] = useState<Date>(new Date());
  const [maxTime, setMaxTime] = useState<Date>(new Date());
  const [units, setUnits] = useState<TimeUnit[]>([]); // This is the time units to be displayed in the time ruler
  const [millisecondWidth, setMillisecondWidth] = useState<number>(0); // This is the width of 1 millisecond in pixels
  const [lowestUnitWidth, setLowestUnitWidth] = useState<number>(defaultLowestUnitWidth); // This is the width of the lowest unit in pixels

  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (rightPanelRef.current) {
        const containerWidth = rightPanelRef.current.offsetWidth;
        const units = zoomLevels.find((level) => level.name === zoomLevelName)?.units || [];

        const lowestUnit = units[units.length - 1];
        const lowestUnitDuration = getMillisecondsInTimeUnit(lowestUnit);

        const allTasks = taskGroups.flatMap((group) => group.tasks);
        const minTime = new Date(Math.min(...allTasks.map((task) => task.startTime.getTime())));
        const maxTime = new Date(Math.max(...allTasks.map((task) => task.endTime.getTime())));
        const roundedMinTime = roundDown(minTime, lowestUnit);
        const roundedMaxTime = roundUp(maxTime, lowestUnit);
        const totalDuration = roundedMaxTime.getTime() - roundedMinTime.getTime();

        const newLowestUnitWidth = Math.round((containerWidth * lowestUnitDuration) / totalDuration);
        if (lowestUnitWidth < newLowestUnitWidth) {
          setLowestUnitWidth(newLowestUnitWidth);
        }

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
  }, [lowestUnitWidth, taskGroups, zoomLevelName]);

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

  const handleResizeLeftPanel = (_event: unknown, { size }: { size: { width: number; height: number } }) => {
    setLeftPanelWidth(size.width);
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLowestUnitWidth(defaultLowestUnitWidth); // Reset the lowest unit width when changing zoom level
    setZoomLevelName(event.target.value);
  };

  const handleLowestUnitWidthChange = (valueString: string) => {
    const value = Math.round(parseInt(valueString, 10) / 5) * 5; // Round to the nearest multiple of 5
    setLowestUnitWidth(value);
  };

  return (
    <ChakraProvider>
      <div className={styles.ganttChart}>
        <div className={styles.zoomControl}>
          <FormControl as={Flex} alignItems="center" justifyContent="flex-end">
            <Box display="flex" alignItems="center">
              <FormLabel htmlFor="zoom" fontWeight="bold" whiteSpace="nowrap" mb="0">
                Zoom:
              </FormLabel>
              <Select id="zoom" value={zoomLevelName} onChange={handleZoomChange} ml="2" mr="4" width="auto">
                {zoomLevels.map((level, index) => (
                  <option key={index} value={level.name}>
                    {level.name}
                  </option>
                ))}
              </Select>
            </Box>
            <Box display="flex" alignItems="center">
              <FormLabel htmlFor="lowest-unit-width" fontWeight="bold" whiteSpace="nowrap" mb="0">
                Unit Width:
              </FormLabel>
              <NumberInput
                id="lowest-unit-width"
                value={lowestUnitWidth}
                onChange={handleLowestUnitWidthChange}
                step={5}
                min={20}
                ml="2"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </FormControl>
        </div>
        <div className={styles.mainContainer}>
          <ResizableBox
            width={leftPanelWidth}
            height={Infinity}
            resizeHandles={['e']}
            onResize={handleResizeLeftPanel}
            minConstraints={[200, Infinity]}
            maxConstraints={[600, Infinity]}
            className={styles.leftPanel}
          >
            <>
              <div
                className={styles.leftHeader}
                style={{ height: `${parseInt(styles.ganttChartHeaderHeight) * units.length}px` }}
              >
                <div>
                  {taskGroupIcon && <InlineIcon>{taskGroupIcon}</InlineIcon>}
                  <span>{taskGroupCaption || 'Name'}</span>
                </div>
              </div>
              <TaskList
                taskGroups={taskGroups}
                onTaskGroupToggle={handleTaskGroupToggle}
                expandedGroups={expandedGroups}
                taskGroupCaption={taskGroupCaption}
                taskGroupIcon={taskGroupIcon}
                taskTypeInfos={taskTypeInfos}
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
              millisecondWidth={millisecondWidth}
            />
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default GanttChart;
