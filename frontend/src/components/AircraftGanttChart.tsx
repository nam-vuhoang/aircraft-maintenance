import React from 'react';
import { FaPlane } from 'react-icons/fa';
import { MdBuild, MdFlightTakeoff } from 'react-icons/md';
import styles from './AircraftGanttChart.module.scss';
import { Flight, WorkPackage } from '../models';
import { Task, TaskGroup, sortTaskGroups } from '../modules/ganttChart';
import { GanttChart } from '../modules/ganttChart/components';

interface AircraftGanttChartProps {
  flights: Flight[];
  workPackages: WorkPackage[];
}

/**
 * Index of the flight type, used to differ colors in GanttCharts.
 */
export const FlightTypeIndex = 0;

/**
 * Convert a flight to a task.
 * @param flight
 * @returns
 */
const convertFlightToTask = (flight: Flight): Task => ({
  name: flight.flightNumber,
  startTime: flight.actualDepartureTime || flight.estimatedDepartureTime || flight.scheduledDepartureTime,
  endTime: flight.actualArrivalTime || flight.estimatedArrivalTime || flight.scheduledArrivalTime,
  startName: flight.scheduledDepartureStation,
  endName: flight.scheduledArrivalStation,
  ...flight,
  typeIndex: FlightTypeIndex,
});

/**
 * Add flights to aircraft task groups.
 * @param flights
 * @param taskGroups
 */
const addFlightsToTaskGroups = (flights: Flight[], taskGroups: TaskGroup[]): void => {
  flights.forEach((flight) => {
    const groupName = flight.registration;
    const task = convertFlightToTask(flight);
    const taskGroup = taskGroups.find((group) => group.name === groupName);
    if (taskGroup) {
      taskGroup.tasks.push(task);
    } else {
      taskGroups.push({
        name: groupName,
        tasks: [task],
      });
    }
  });
};

/**
 * Index of the work package type, used to differ colors in GanttCharts.
 */
const WorkPackageTypeIndex = 1;

/**
 * Convert a work package to a task.
 * @param workPackage
 * @returns
 */
const convertWorkPackageToTask = (workPackage: WorkPackage): Task => ({
  ...workPackage,
  typeIndex: WorkPackageTypeIndex,
});

/**
 * Add work packages to task groups.
 * @param workPackages
 * @param taskGroups
 */
const addWorkPackagesToTaskGroups = (workPackages: WorkPackage[], taskGroups: TaskGroup[]) => {
  workPackages.forEach((workPackage) => {
    const groupName = workPackage.registration;
    const task = convertWorkPackageToTask(workPackage);
    const taskGroup = taskGroups.find((group) => group.name === groupName);
    if (taskGroup) {
      taskGroup.tasks.push(task);
    } else {
      taskGroups.push({
        name: groupName,
        tasks: [task],
      });
    }
  });
};

const AircraftGanttChart: React.FC<AircraftGanttChartProps> = ({ flights, workPackages }) => {
  const taskGroups: TaskGroup[] = [];
  addFlightsToTaskGroups(flights, taskGroups);
  addWorkPackagesToTaskGroups(workPackages, taskGroups);
  sortTaskGroups(taskGroups);
  return (
    <GanttChart
      taskGroups={taskGroups}
      taskGroupCaption="Aircrafts"
      taskGroupIcon={<FaPlane />}
      taskTypeInfos={[
        {
          typeIndex: FlightTypeIndex,
          caption: 'Flight',
          barColor: styles.ganttChartTaskBarColor1,
          textColor: styles.ganttChartTaskTextColor1,
          icon: <MdFlightTakeoff />,
        },
        {
          typeIndex: WorkPackageTypeIndex,
          caption: 'Work Package',
          barColor: styles.ganttChartTaskBarColor2,
          textColor: styles.ganttChartTaskTextColor2,
          icon: <MdBuild />,
        },
      ]}
    />
  );
};

export default AircraftGanttChart;
