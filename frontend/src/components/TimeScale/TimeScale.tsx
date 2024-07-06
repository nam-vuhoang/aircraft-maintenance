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

  const unitBoxes = timeMarkBoxes[timeMarkBoxes.length - 1];
  const unitCount = unitBoxes.length;

  for (let i = timeMarkBoxes.length - 2; i >= 0; i--) {
    const upperBoxes = timeMarkBoxes[i];
    let k = unitCount - 1;
    for (let j = upperBoxes.length - 1; j >= 0; j--) {
      upperBoxes[j].weight = 0; // reset weight
      while (k >= 0 && upperBoxes[j].time <= unitBoxes[k].time) {
        upperBoxes[j].weight += unitBoxes[k].weight;
        k--;
      }
    }
  }

  unitWidth = Math.round(Math.max(unitWidth, containerWidth / unitCount));

  return (
    <Box className="time-scale" ref={containerRef} width="100%">
      {timeMarkBoxes.map((timeUnitBoxRow, i) => (
        <Box key={i} className="time-unit-row" display="flex" width={`${unitWidth * unitCount}px`}>
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
              width={`${unitWidth * timeUnitBox.weight}px`} // Width based on weight and calculated box width
            >
              <Text
                whiteSpace="nowrap"
                title={`${timeUnitBox.time.toLocaleString()}\n{weight: ${timeUnitBox.weight.toString()}), width: ${
                  unitWidth * timeUnitBox.weight
                }px}`}
              >
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
