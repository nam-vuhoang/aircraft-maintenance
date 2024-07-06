import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import './TimeScale.module.scss';
import { TimeUnit, roundUp, getTimeMarksOfInterval } from '../../utils/TimeUtils';
import moment from 'moment';

export interface TimeScaleFormat {
  /**
   * Time unit for the scale, e.g. 'hour', 'hour-2', 'hour-3', 'hour-6', 'day', 'week', 'month'
   */
  timeUnit: TimeUnit;

  /**
   * Date format according to moment library (see https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/)
   */
  format: string;
}

interface TimeScaleProps {
  minTime: Date;
  maxTime: Date;
  scaleFormats: TimeScaleFormat[];
  unitWidth?: number; // Minimum width of each time unit box
}

interface TimeMarkBox {
  time: Date;
  weight: number;
  text: string;
}

const TimeScale: React.FC<TimeScaleProps> = ({ scaleFormats, minTime, maxTime, unitWidth = 25 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(unitWidth);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  const lowestScaleFormat = scaleFormats[scaleFormats.length - 1];
  maxTime = roundUp(maxTime, lowestScaleFormat.timeUnit);

  const timeMarkBoxes: TimeMarkBox[][] = scaleFormats.map((scaleFormat) => {
    const timeMarks: Date[] = getTimeMarksOfInterval(minTime, maxTime, scaleFormat.timeUnit);
    return timeMarks.map((time) => ({
      time,
      weight: 1,
      text: moment(time).format(scaleFormat.format),
    }));
  });

  for (let i = timeMarkBoxes.length - 2; i >= 0; i--) {
    const upperBoxes = timeMarkBoxes[i];
    const lowerBoxes = timeMarkBoxes[i + 1];
    let k = lowerBoxes.length - 1;
    for (let j = upperBoxes.length - 1; j >= 0; j--) {
      upperBoxes[j].weight = 0;
      while (k >= 0 && upperBoxes[j].time <= lowerBoxes[k].time) {
        upperBoxes[j].weight += lowerBoxes[k].weight;
        k--;
      }
    }
  }

  unitWidth = Math.max(unitWidth, containerWidth / timeMarkBoxes[timeMarkBoxes.length - 1].length);

  return (
    <Box className="time-scale" ref={containerRef} width="100%" overflowX="auto">
      {timeMarkBoxes.map((timeUnitBoxRow, i) => (
        <Box key={i} className="time-unit-row" display="flex">
          {timeUnitBoxRow.map((timeUnitBox, j) => (
            <Box
              key={j}
              className="time-unit"
              display="inline-flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRight="1px solid #e2e8f0"
              paddingY="5px"
              width={`${containerWidth * timeUnitBox.weight}px`} // Width based on weight and calculated box width
            >
              <Text title={`${timeUnitBox.time.toLocaleString()} (weight: ${timeUnitBox.weight.toString()})`}>
                {timeUnitBox.text}
              </Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default TimeScale;
