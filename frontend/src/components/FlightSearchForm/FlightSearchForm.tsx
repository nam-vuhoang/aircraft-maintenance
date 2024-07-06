import React, { useEffect, useState } from 'react';
import { Input, Button } from '@chakra-ui/react';
import { Select } from 'chakra-react-select'; // Import the 'Option' type
import CategoryService from '../../services/Category.service';
import { FlightFilter } from '../../models/FlightFilter.dto';
interface FlightSearchFormProps {
  onSearch: (filter: FlightFilter) => void;
}

interface Option {
  label: string;
  value: string;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch }) => {
  const [airlines, setAirlines] = useState<Option[]>([]);
  const [registrations, setRegistrations] = useState<Option[]>([]);
  const [aircraftTypes, setAircraftTypes] = useState<Option[]>([]);
  const [departureStations, setDepartureStations] = useState<Option[]>([]);
  const [arrivalStations, setArrivalStations] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [airlinesData, registrationsData, aircraftTypesData, stationsData] = await Promise.all([
        CategoryService.getFlightCategoryValues('airlines'),
        CategoryService.getFlightCategoryValues('registrations'),
        CategoryService.getFlightCategoryValues('aircraftTypes'),
        CategoryService.getFlightCategoryValues('stations'),
      ]);

      setAirlines(airlinesData.map((item: string) => ({ label: item, value: item })));
      setRegistrations(registrationsData.map((item: string) => ({ label: item, value: item })));
      setAircraftTypes(aircraftTypesData.map((item: string) => ({ label: item, value: item })));
      setDepartureStations(stationsData.map((item: string) => ({ label: item, value: item })));
      setArrivalStations(stationsData.map((item: string) => ({ label: item, value: item })));
    };

    fetchData(); // initial fetch
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const newFilter = {
      startTime: formData.get('startTime') ? new Date(formData.get('startTime')!.toString()) : undefined,
      endTime: formData.get('endTime') ? new Date(formData.get('endTime')!.toString()) : undefined,
      flightNumbers: formData.get('flightNumbers') ? formData.get('flightNumbers')!.toString().split(',') : undefined,
      airlines: formData.getAll('airlines') as string[],
      registrations: formData.getAll('registrations') as string[],
      aircraftTypes: formData.getAll('aircraftTypes') as string[],
      departureStations: formData.getAll('departureStations') as string[],
      arrivalStations: formData.getAll('arrivalStations') as string[],
    };
    onSearch(newFilter);
  };

  return (
    <form onSubmit={handleSearch}>
      <Input type="datetime-local" name="startTime" placeholder="Start Time" />
      <Input type="datetime-local" name="endTime" placeholder="End Time" />
      <Input type="text" name="flightNumbers" placeholder="Flight Numbers (comma separated)" />
      <Select isMulti name="airlines" options={airlines} placeholder="Select airlines..." />
      <Select isMulti name="registrations" options={registrations} placeholder="Select registrations..." />
      <Select isMulti name="aircraftTypes" options={aircraftTypes} placeholder="Select aircraft types..." />
      <Select isMulti name="departureStations" options={departureStations} placeholder="Select departure stations..." />
      <Select isMulti name="arrivalStations" options={arrivalStations} placeholder="Select arrival stations..." />
      <Button type="submit">Search</Button>
    </form>
  );
};

export default FlightSearchForm;
