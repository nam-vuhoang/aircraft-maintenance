import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import styles from './TimeRuler.module.scss'; // Import styles as a module
import { roundUp, getTimeMarksOfInterval, TimeUnit } from '../../utils/TimeUtils';
import moment from 'moment';

interface TimeRulerProps {
  minTime: Date;
  maxTime: Date;
  units: TimeUnit[];
  minUnitWidth?: number; // Minimum width of each time unit box
}

/**
 * Time scale format for the time ruler.
 */
interface TimeScaleFormat {
  /**
   * Time unit for the scale, e.g. 'hour', 'hour-2', 'hour-3', 'hour-6', 'day', 'week', 'month'
   */
  unit: TimeUnit;

  /**
   * Date format according to moment library (see https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/)
   */
  fullFormat?: string;

  /**
   * The minimum width of the time unit box, defined in number of single time units.
   */
  fullFormatWeightLimit?: number;

  /**
   * Date format according to moment library (see https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/)
   */
  shortFormat: string;
}

/**
 * Gets the default time scale format for the given time unit.
 * @param unit
 * @returns
 */
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

const TimeRuler: React.FC<TimeRulerProps> = ({ units, minTime, maxTime, minUnitWidth = 25 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

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

  const scaleFormats = units.map((unit) => getDefaultTimeScaleFormat(unit));
  const lowestScaleFormat = scaleFormats[scaleFormats.length - 1];
  maxTime = roundUp(maxTime, lowestScaleFormat.unit);

  const timeScales: TimeScale[] = scaleFormats.map((scaleFormat) => {
    const timeMarks: Date[] = getTimeMarksOfInterval(minTime, maxTime, scaleFormat.unit);
    return {
      scaleFormat,
      boxes: timeMarks.map((time) => ({
        time,
        weight: 1,
      })),
    };
  });

  const unitScale = timeScales[timeScales.length - 1];
  const unitBoxes = unitScale.boxes;
  const unitCount = unitBoxes.length;

  for (let i = timeScales.length - 2; i >= 0; i--) {
    const upperBoxes = timeScales[i].boxes;
    let unitIndex = unitCount - 1;
    for (let j = upperBoxes.length - 1; j >= 0; j--) {
      upperBoxes[j].weight = 0; // reset weight
      while (unitIndex >= 0 && upperBoxes[j].time <= unitBoxes[unitIndex].time) {
        upperBoxes[j].weight += unitBoxes[unitIndex].weight;
        unitIndex--;
      }
    }
  }

  const unitWidth = Math.round(Math.max(minUnitWidth, containerWidth / unitCount));

  return (
    <Box className={styles.timeRuler} ref={containerRef} width="100%">
      {timeScales.map((timeScale, i) => (
        <Box key={i} className={styles.timeScale} display="flex" width={`${unitWidth * unitCount}px`}>
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
