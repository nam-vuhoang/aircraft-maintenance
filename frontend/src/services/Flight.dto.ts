import { Flight } from '../models/Flight.entity';

/**
 * Flight DTO (Data Transfer Object) interface, used for retrieving flight data from the server.
 */
export interface FlightDto {
  id: string;
  airline: string;
  registration: string;
  aircraftType: string;
  flightNumber: string;
  scheduledDepartureStation: string;
  scheduledArrivalStation: string;
  scheduledDepartureTime: string;
  scheduledArrivalTime: string;
  estimatedDepartureTime?: string;
  estimatedArrivalTime?: string;
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  departureStand?: string;
  originalDepartureStand?: string;
  arrivalStand?: string;
  originalArrivalStand?: string;
}

export const convertFlightDtoToFlight = (json: FlightDto): Flight => {
  return {
    ...json,
    scheduledDepartureTime: new Date(json.scheduledDepartureTime),
    scheduledArrivalTime: new Date(json.scheduledArrivalTime),
    estimatedDepartureTime: json.estimatedDepartureTime ? new Date(json.estimatedDepartureTime) : undefined,
    estimatedArrivalTime: json.estimatedArrivalTime ? new Date(json.estimatedArrivalTime) : undefined,
    actualDepartureTime: json.actualDepartureTime ? new Date(json.actualDepartureTime) : undefined,
    actualArrivalTime: json.actualArrivalTime ? new Date(json.actualArrivalTime) : undefined,
  };
};
