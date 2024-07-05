import React from 'react';
import styles from './TimeScale.module.scss';

interface TimeScaleProps {
  minDate: Date;
  maxDate: Date;
  zoomLevel: 'hours' | 'days' | 'months';
}

function getWeekNumber(date: Date): number {
  let tempDate = new Date(date.getTime());
  tempDate.setDate(tempDate.getDate() + 6 - (tempDate.getDay() || 7));
  let yearStart = new Date(tempDate.getFullYear(), 0, 1);
  yearStart.setDate(yearStart.getDate() + 6 - (yearStart.getDay() || 7));
  return Math.ceil((((tempDate as any) - (yearStart as any)) / 86400000 + 1) / 7);
}

const TimeScale: React.FC<TimeScaleProps> = ({ minDate, maxDate, zoomLevel }) => {
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
    <div className={styles.rightHeader}>
      <div className={styles.topRow}>
        {headers.top.map((header, index) => (
          <div
            key={index}
            className={`${styles.cell} ${
              new Date(minDate.getTime() + index * (timeSpan / headers.top.length)).getDay() === 0 ? styles.sunday : ''
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
  );
};

export default TimeScale;
