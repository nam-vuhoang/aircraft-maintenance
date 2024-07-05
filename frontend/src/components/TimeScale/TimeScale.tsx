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
  startTime: Date;
  endTime: Date;
  scaleFormats: TimeScaleFormat[];
  unitWidth?: number;
}

interface TimeMarkBox {
  time: Date;
  count: number;
  text: string;
}

const TimeScale: React.FC<TimeScaleProps> = ({ scaleFormats, startTime, endTime, unitWidth = 10 }) => {
  const lowestScaleFormat = scaleFormats[scaleFormats.length - 1];
  endTime = roundUp(endTime, lowestScaleFormat.timeUnit);

  const timeMarkBoxes: TimeMarkBox[][] = scaleFormats.map((scaleFormat) => {
    const timeMarks: Date[] = getTimeMarksOfInterval(startTime, endTime, scaleFormat.timeUnit);
    return timeMarks.map((time) => ({
      time,
      count: 1,
      text: moment(time).format(scaleFormat.format),
    }));
  });

  for (let i = timeMarkBoxes.length - 2; i >= 0; i--) {
    const upperBoxes = timeMarkBoxes[i];
    const lowerBoxes = timeMarkBoxes[i + 1];
    let k = lowerBoxes.length - 1;
    for (let j = upperBoxes.length - 1; j >= 0; j--) {
      upperBoxes[j].count = 0;
      while (k >= 0 && upperBoxes[j].time <= lowerBoxes[k].time) {
        upperBoxes[j].count += lowerBoxes[k].count;
        k--;
      }
    }
  }

  return (
    <Box className="time-scale" width="100%">
      {timeMarkBoxes.map((timeUnitBoxRow, i) => (
        <Box key={i} display="flex" width="100%">
          {timeUnitBoxRow.map((timeUnitBox, j) => (
            <Box
              key={j}
              flexGrow={timeUnitBox.count}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRight="1px solid #e2e8f0"
              paddingY="5px"
              width={`${timeUnitBox.count * unitWidth}px`}
            >
              <Text title={timeUnitBox.time.toLocaleDateString() + ',' + timeUnitBox.count.toString()}>
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
