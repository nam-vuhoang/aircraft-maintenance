import React, { useState } from 'react';
import TaskList from './TaskList';
import Timeline from './Timeline';
import styles from './GanttChart.module.scss';
import { TaskGroup } from '../../models/TaskGroup';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface GanttChartProps {
  taskGroups: TaskGroup[];
}

type ZoomLevel = 'hours' | 'days' | 'months';

function getWeekNumber(date: Date): number {
  let tempDate = new Date(date.getTime());
  tempDate.setDate(tempDate.getDate() + 6 - (tempDate.getDay() || 7));
  let yearStart = new Date(tempDate.getFullYear(), 0, 1);
  yearStart.setDate(yearStart.getDate() + 6 - (yearStart.getDay() || 7));
  return Math.ceil((((tempDate as any) - (yearStart as any)) / 86400000 + 1) / 7);
}

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
  const timeSpan = maxDate.getTime() - minDate.getTime();

  const generateHeaders = () => {
    const headers: { top: { value: string; span: number }[]; bottom: string[] } = { top: [], bottom: [] };

    if (zoomLevel === 'hours') {
      let lastDay = '';
      let daySpan = 0;
      for (let d = new Date(minDate); d <= maxDate; d.setHours(d.getHours() + 1)) {
        const dayLabel = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        const hourLabel = d.getHours().toString().padStart(2, '0');
        if (dayLabel !== lastDay) {
          if (daySpan > 0) {
            headers.top.push({ value: lastDay, span: daySpan });
          }
          lastDay = dayLabel;
          daySpan = 1;
        } else {
          daySpan++;
        }
        headers.bottom.push(hourLabel);
      }
      if (daySpan > 0) {
        headers.top.push({ value: lastDay, span: daySpan });
      }
    } else if (zoomLevel === 'days') {
      let lastWeek = '';
      let weekSpan = 0;
      for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
        const weekLabel = `#${getWeekNumber(d)}`;
        const dayLabel = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        if (weekLabel !== lastWeek) {
          if (weekSpan > 0) {
            headers.top.push({ value: lastWeek, span: weekSpan });
          }
          lastWeek = weekLabel;
          weekSpan = 1;
        } else {
          weekSpan++;
        }
        headers.bottom.push(dayLabel);
      }
      if (weekSpan > 0) {
        headers.top.push({ value: lastWeek, span: weekSpan });
      }
    } else if (zoomLevel === 'months') {
      let lastMonth = '';
      let monthSpan = 0;
      for (let d = new Date(minDate); d <= maxDate; d.setMonth(d.getMonth() + 1)) {
        const monthLabel = d.toLocaleDateString('en-US', { month: 'long' });
        const weekLabel = `#${getWeekNumber(d)}`;
        if (monthLabel !== lastMonth) {
          if (monthSpan > 0) {
            headers.top.push({ value: lastMonth, span: monthSpan });
          }
          lastMonth = monthLabel;
          monthSpan = 1;
        } else {
          monthSpan++;
        }
        headers.bottom.push(weekLabel);
      }
      if (monthSpan > 0) {
        headers.top.push({ value: lastMonth, span: monthSpan });
      }
    }

    return headers;
  };

  const headers = generateHeaders();

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
          <div className={styles.rightHeader}>
            <div className={styles.topRow}>
              {headers.top.map((header, index) => (
                <div
                  key={index}
                  className={`${styles.cell} ${
                    new Date(minDate.getTime() + index * (timeSpan / headers.top.length)).getDay() === 0
                      ? styles.sunday
                      : ''
                  }`}
                  style={{ flex: header.span }}
                >
                  {header.value}
                </div>
              ))}
            </div>
            <div className={styles.bottomRow}>
              {headers.bottom.map((header, index) => (
                <div
                  key={index}
                  className={`${styles.cell} ${
                    new Date(minDate.getTime() + index * (timeSpan / headers.bottom.length)).getDay() === 0
                      ? styles.sunday
                      : ''
                  }`}
                >
                  {header}
                </div>
              ))}
            </div>
          </div>
          <Timeline taskGroups={taskGroups} expandedGroups={expandedGroups} zoomLevel={zoomLevel} />
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
