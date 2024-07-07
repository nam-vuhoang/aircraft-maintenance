import { Task } from './Task.entity';
import { TaskGroup } from './TaskGroup.entity';

/**
 * Index of the flight type, used to differ colors in GanttCharts.
 */
export const FlightTypeIndex = 0;
export interface Flight {
  id: string;
  airline: string;
  registration: string;
  aircraftType: string;
  flightNumber: string;
  scheduledDepartureStation: string;
  scheduledArrivalStation: string;
  scheduledDepartureTime: Date;
  scheduledArrivalTime: Date;
  estimatedDepartureTime?: Date;
  estimatedArrivalTime?: Date;
  actualDepartureTime?: Date;
  actualArrivalTime?: Date;
  departureStand?: string;
  originalDepartureStand?: string;
  arrivalStand?: string;
  originalArrivalStand?: string;
}

/**
 * Convert a flight to a task.
 * @param flight
 * @returns
 */
export const convertFlightToTask = (flight: Flight): Task => ({
  ...flight,
  typeIndex: FlightTypeIndex,
  name: flight.flightNumber,
  startTime: flight.actualDepartureTime || flight.estimatedDepartureTime || flight.scheduledDepartureTime,
  endTime: flight.actualArrivalTime || flight.estimatedArrivalTime || flight.scheduledArrivalTime,
  startName: flight.departureStand || flight.originalDepartureStand,
  endName: flight.arrivalStand || flight.originalArrivalStand,
});

/**
 * Add flights to aircraft task groups.
 * @param flights
 * @param taskGroups
 */
export const addFlightsToTaskGroups = (flights: Flight[], taskGroups: TaskGroup[]): void => {
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
