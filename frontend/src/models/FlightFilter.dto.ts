export interface FlightFilter {
  startTime?: Date;
  endTime?: Date;
  flightNumbers?: string[];
  airlines?: string[];
  registrations?: string[];
  aircraftTypes?: string[];
  departureStations?: string[];
  arrivalStations?: string[];
  limit?: number;
}
