import React, { useEffect, useRef } from 'react';
import styles from './Timeline.module.scss';
import { TaskGroup } from '../../models/TaskGroup';

interface TimelineProps {
  taskGroups: TaskGroup[];
  expandedGroups: Set<string>;
}

const drawRoundedRectangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.stroke();
};

const getTaskColor = (type: number) => {
  return type === 1 ? 'rgba(0, 123, 255, 0.5)' : 'rgba(255, 87, 51, 0.5)';
};

const Timeline: React.FC<TimelineProps> = ({ taskGroups, expandedGroups }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const rowHeight = 35;
        let currentRow = 0;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const allTasks = taskGroups.flatMap((group) => group.tasks);
        const minDate = new Date(Math.min(...allTasks.map((task) => task.start.getTime())));
        const maxDate = new Date(Math.max(...allTasks.map((task) => task.end.getTime())));

        const timeSpan = maxDate.getTime() - minDate.getTime();

        taskGroups.forEach((group) => {
          const isExpanded = expandedGroups.has(group.name);
          if (isExpanded) {
            currentRow++;
          }

          group.tasks.forEach((task) => {
            const taskStartX = ((task.start.getTime() - minDate.getTime()) / timeSpan) * canvasWidth;
            const taskEndX = ((task.end.getTime() - minDate.getTime()) / timeSpan) * canvasWidth;
            const taskWidth = taskEndX - taskStartX;
            const taskColor = getTaskColor(task.type);

            drawRoundedRectangle(ctx, taskStartX, currentRow * rowHeight, taskWidth, rowHeight - 10, 5, taskColor);

            ctx.fillStyle = '#000000';
            ctx.fillText(task.name, taskStartX + 5, currentRow * rowHeight + 20);

            if (isExpanded) {
              currentRow++;
            }
          });

          if (!isExpanded) {
            currentRow++;
          }
        });
      }
    }
  }, [taskGroups, expandedGroups]);

  return <canvas ref={canvasRef} className={styles.timeline} width={800} height={600} />;
};

export default Timeline;
