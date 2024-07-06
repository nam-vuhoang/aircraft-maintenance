import React from 'react';
import { Input, Button } from '@chakra-ui/react';
import { FlightFilter } from '../../models/FlightFilter.dto';

interface FlightSearchFormProps {
  onSearch: (filter: FlightFilter) => void;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch }) => {
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const newFilter = {
      startTime: formData.get('startTime') ? new Date(formData.get('startTime')!.toString()) : undefined,
      endTime: formData.get('endTime') ? new Date(formData.get('endTime')!.toString()) : undefined,
      flightNumbers: formData.get('flightNumbers') ? formData.get('flightNumbers')!.toString().split(',') : undefined,
      airlines: formData.get('airlines') ? formData.get('airlines')!.toString().split(',') : undefined,
      registrations: formData.get('registrations') ? formData.get('registrations')!.toString().split(',') : undefined,
      aircraftTypes: formData.get('aircraftTypes') ? formData.get('aircraftTypes')!.toString().split(',') : undefined,
      departureStations: formData.get('departureStations')
        ? formData.get('departureStations')!.toString().split(',')
        : undefined,
      arrivalStations: formData.get('arrivalStations')
        ? formData.get('arrivalStations')!.toString().split(',')
        : undefined,
    };
    onSearch(newFilter);
  };

  return (
    <form onSubmit={handleSearch}>
      <Input type="datetime-local" name="startTime" placeholder="Start Time" />
      <Input type="datetime-local" name="endTime" placeholder="End Time" />
      <Input type="text" name="flightNumbers" placeholder="Flight Numbers (comma separated)" />
      <Input type="text" name="airlines" placeholder="Airlines (comma separated)" />
      <Input type="text" name="registrations" placeholder="Registrations (comma separated)" />
      <Input type="text" name="aircraftTypes" placeholder="Aircraft Types (comma separated)" />
      <Input type="text" name="departureStations" placeholder="Departure Stations (comma separated)" />
      <Input type="text" name="arrivalStations" placeholder="Arrival Stations (comma separated)" />
      <Button type="submit">Search</Button>
    </form>
  );
};

export default FlightSearchForm;
