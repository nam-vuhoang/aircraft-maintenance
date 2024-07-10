import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import styles from './TimeRuler.module.scss';
import { getMillisecondsInTimeUnit, getTimeMarksOfInterval, roundDown, roundUp, TimeUnit } from '../../utils/TimeUtils';
import moment from 'moment';

interface TimeRulerProps {
  minTime: Date;
  maxTime: Date;
  units: TimeUnit[];
  millisecondWidth: number;
}
interface TimeScaleFormat {
  unit: TimeUnit;
  fullFormat?: string;
  fullFormatWeightLimit?: number;
  shortFormat: string;
}

const getDefaultTimeScaleFormat = (unit: TimeUnit): TimeScaleFormat => {
  switch (unit) {
    case 'hour':
    case 'hour-1':
    case 'hour-2':
    case 'hour-3':
    case 'hour-6':
      return { unit, shortFormat: 'HH' };
    case 'day':
      return { unit, fullFormat: 'DD MMM', fullFormatWeightLimit: 2, shortFormat: 'DD' };
    case 'week':
      return { unit, fullFormat: '[Week ]w', fullFormatWeightLimit: 3, shortFormat: '[W]w' };
    case 'month':
      return { unit, fullFormat: 'MMMM yyyy', fullFormatWeightLimit: 4, shortFormat: 'MMM' };
    default:
      throw new Error(`Unsupported time unit: ${unit}`);
  }
};

type TimeScale = {
  scaleFormat: TimeScaleFormat;
  boxes: {
    time: Date;
    weight: number;
  }[];
};

const TimeRuler: React.FC<TimeRulerProps> = ({ minTime, maxTime, units, millisecondWidth }) => {
  const lowestUnit = units[units.length - 1];
  minTime = roundDown(minTime, lowestUnit); // double check if this is necessary
  maxTime = roundUp(maxTime, lowestUnit); // double check if this is necessary

  const timeScales: TimeScale[] = units.map((unit, unitIndex) => {
    const timeMarks: Date[] = getTimeMarksOfInterval(minTime, maxTime, unit);
    return {
      scaleFormat: getDefaultTimeScaleFormat(unit),
      boxes: timeMarks.map((time) => ({
        time,
        weight: unitIndex === units.length - 1 ? 1 : 0,
      })),
    };
  });

  const lowestUnitScale = timeScales[timeScales.length - 1];

  for (let i = timeScales.length - 2; i >= 0; i--) {
    const upperBoxes = timeScales[i].boxes;
    let unitIndex = lowestUnitScale.boxes.length - 1;
    for (let j = upperBoxes.length - 1; j >= 0; j--) {
      while (unitIndex >= 0 && upperBoxes[j].time <= lowestUnitScale.boxes[unitIndex].time) {
        upperBoxes[j].weight++;
        unitIndex--;
      }
    }
  }

  const unitWidth = millisecondWidth * getMillisecondsInTimeUnit(lowestUnit);

  return (
    <Box className={styles.timeRuler} width="100%">
      {timeScales.map((timeScale, i) => (
        <Box
          key={i}
          className={styles.timeScale}
          display="flex"
          width={`${unitWidth * lowestUnitScale.boxes.length}px`}
        >
          {timeScale.boxes.map((timeBox, j) => (
            <Box
              key={j}
              className={`${styles.timeUnit} ${
                timeScale.scaleFormat.unit === 'day' && moment(timeBox.time).day() === 0 ? styles.sunday : ''
              }`}
              display="inline-flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRight="1px solid #e2e8f0"
              paddingY="5px"
              width={`${unitWidth * timeBox.weight}px`} // Width based on weight and calculated box width
            >
              <Text whiteSpace="nowrap" title={timeBox.time.toLocaleString()}>
                {moment(timeBox.time).format(
                  (timeScale.scaleFormat.fullFormatWeightLimit &&
                    timeBox.weight >= timeScale.scaleFormat.fullFormatWeightLimit &&
                    timeScale.scaleFormat.fullFormat) ||
                    timeScale.scaleFormat.shortFormat
                )}
              </Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default TimeRuler;
