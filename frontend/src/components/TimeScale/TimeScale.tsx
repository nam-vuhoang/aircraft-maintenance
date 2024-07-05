import React from 'react';
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
  unitWidth?: number; // Width of each time unit box
}

interface TimeMarkBox {
  time: Date;
  weight: number;
  text: string;
}

const TimeScale: React.FC<TimeScaleProps> = ({ scaleFormats, minTime, maxTime, unitWidth = 25 }) => {
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

  return (
    <Box className="time-scale" width="100%">
      {timeMarkBoxes.map((timeUnitBoxRow, i) => (
        <Box
          key={i}
          className="time-unit-row"
          display="flex"
          overflowX="auto"
          width={`${timeMarkBoxes[timeMarkBoxes.length - 1].length * unitWidth}px`}
        >
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
              width={`${unitWidth * timeUnitBox.weight}px`} // Width based on weight
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
