import React, { useEffect, useRef } from 'react';
import styles from './Timeline.module.scss';
import { TaskGroup } from '../models/TaskGroup';

interface TimelineProps {
  taskGroups: TaskGroup[];
  expandedGroups: Set<string>;
}

const Timeline: React.FC<TimelineProps> = ({ taskGroups, expandedGroups }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const rowHeight = 40;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const allTasks = taskGroups.flatMap((group) => group.tasks);
        const minDate = new Date(Math.min(...allTasks.map((task) => task.start.getTime())));
        const maxDate = new Date(Math.max(...allTasks.map((task) => task.end.getTime())));

        const timeSpan = maxDate.getTime() - minDate.getTime();

        let currentRow = 0;

        taskGroups.forEach((group) => {
          if (expandedGroups.has(group.name)) {
            group.tasks.forEach((task) => {
              const taskStartX = ((task.start.getTime() - minDate.getTime()) / timeSpan) * canvasWidth;
              const taskEndX = ((task.end.getTime() - minDate.getTime()) / timeSpan) * canvasWidth;
              const taskWidth = taskEndX - taskStartX;
              const taskColor = task.type === 1 ? '#007bff' : '#ff5733';

              ctx.fillStyle = taskColor;
              ctx.fillRect(taskStartX, currentRow * rowHeight, taskWidth, rowHeight - 10);
              ctx.strokeRect(taskStartX, currentRow * rowHeight, taskWidth, rowHeight - 10);

              ctx.fillStyle = '#000000';
              ctx.fillText(task.name, taskStartX + 5, currentRow * rowHeight + 20);

              currentRow++;
            });
          } else {
            const groupStartX =
              ((Math.min(...group.tasks.map((task) => task.start.getTime())) - minDate.getTime()) / timeSpan) *
              canvasWidth;
            const groupEndX =
              ((Math.max(...group.tasks.map((task) => task.end.getTime())) - minDate.getTime()) / timeSpan) *
              canvasWidth;
            const groupWidth = groupEndX - groupStartX;

            ctx.fillStyle = '#007bff';
            ctx.fillRect(groupStartX, currentRow * rowHeight, groupWidth, rowHeight - 10);
            ctx.strokeRect(groupStartX, currentRow * rowHeight, groupWidth, rowHeight - 10);

            ctx.fillStyle = '#000000';
            ctx.fillText(group.name, groupStartX + 5, currentRow * rowHeight + 20);

            currentRow++;
          }
        });
      }
    }
  }, [taskGroups, expandedGroups]);

  return <canvas ref={canvasRef} className={styles.timeline} width={800} height={600} />;
};

export default Timeline;
