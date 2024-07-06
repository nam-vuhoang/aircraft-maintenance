import { Task } from './Task.entity';

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

export const mapFlightToTask = (flight: Flight): Task => ({
  ...flight,
  type: 1,
  startTime: flight.actualDepartureTime || flight.estimatedDepartureTime || flight.scheduledDepartureTime,
  endTime: flight.actualArrivalTime || flight.estimatedArrivalTime || flight.scheduledArrivalTime,
  name: flight.flightNumber,
});
