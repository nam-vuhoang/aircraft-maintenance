import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import './TimeScale.module.scss';
import { format } from 'date-fns';
import { TimeUnit, roundDown, roundUp, getTimeMarksOfInterval } from '../../utils/TimeUtils';

export interface TimeScaleFormat {
  timeUnit: TimeUnit;
  format: string;
}

interface TimeScaleProps {
  startTime: Date;
  endTime: Date;
  scaleFormats: TimeScaleFormat[];
}

interface TimeMarkBox {
  time: Date;
  count: number;
  text: string;
}

const TimeScale: React.FC<TimeScaleProps> = ({ scaleFormats, startTime, endTime }) => {
  const lowestScaleFormat = scaleFormats[scaleFormats.length - 1];

  console.log('TimeScale.tsx', 'TimeScale', 'startTime-1', startTime);
  console.log('TimeScale.tsx', 'TimeScale', 'endTime-1', endTime);

  endTime = roundUp(endTime, lowestScaleFormat.timeUnit);

  console.log('TimeScale.tsx', 'TimeScale', 'startTime-2', startTime);
  console.log('TimeScale.tsx', 'TimeScale', 'endTime-2', endTime);

  const timeMarkBoxes: TimeMarkBox[][] = scaleFormats.map((scaleFormat) => {
    const timeMarks: Date[] = getTimeMarksOfInterval(startTime, endTime, scaleFormat.timeUnit);
    return timeMarks.map((time) => ({
      time,
      count: 1,
      text: format(time, scaleFormat.format),
    }));
  });

  console.log('TimeScale.tsx', 'TimeScale', 'timeMarkBoxes', timeMarkBoxes);

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
              width={`${timeUnitBox.count * 10}px`}
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
