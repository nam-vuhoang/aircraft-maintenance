import { Task } from './Task.entity';
import { TaskGroup } from './TaskGroup.entity';

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

export const mapFlightToAircraftTask = (flight: Flight): Task => ({
  ...flight,
  type: 1,
  startTime: flight.actualDepartureTime || flight.estimatedDepartureTime || flight.scheduledDepartureTime,
  endTime: flight.actualArrivalTime || flight.estimatedArrivalTime || flight.scheduledArrivalTime,
  name: flight.flightNumber,
});

export const addFlightsToAircraftTaskGroups = (flights: Flight[], taskGroups: TaskGroup[]) => {
  flights.forEach((flight) => {
    const groupName = flight.registration;
    const task = mapFlightToAircraftTask(flight);
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
