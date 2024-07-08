export interface FlightImportDto {
  flightId: string;
  airline: string;
  registration: string;
  aircraftType: string;
  flightNum: string;
  schedDepTime: string;
  schedArrTime: string;
  actualDepTime?: string;
  actualArrTime?: string;
  estimatedDepTime?: string;
  estimatedArrTime?: string;
  schedDepStation: string;
  schedArrStation: string;
  depStand?: string;
  origDepStand?: string;
  arrStand?: string;
  origArrStand?: string;
}
