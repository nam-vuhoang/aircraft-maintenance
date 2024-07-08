import React, { useEffect, useState } from 'react';
import { Box, Input, Button, VStack, HStack, useColorModeValue, FormControl, FormLabel } from '@chakra-ui/react';
import CategoryService from '../services/Category.service';
import { FlightFilter } from '../models/FlightFilter.dto';
import MultiSelect from './utils/MultiSelect';

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

  const [formValues, setFormValues] = useState({
    startTime: '',
    endTime: '',
    flightNumbers: '',
    airlines: [],
    registrations: [],
    aircraftTypes: [],
    departureStations: [],
    arrivalStations: [],
  });

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: Option[]) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const newFilter: FlightFilter = {
      startTime: formValues.startTime ? new Date(formValues.startTime) : undefined,
      endTime: formValues.endTime ? new Date(formValues.endTime) : undefined,
      flightNumbers: formValues.flightNumbers ? formValues.flightNumbers.split(',') : undefined,
      airlines: formValues.airlines.length > 0 ? formValues.airlines.map((option: Option) => option.value) : undefined,
      registrations:
        formValues.registrations.length > 0
          ? formValues.registrations.map((option: Option) => option.value)
          : undefined,
      aircraftTypes:
        formValues.aircraftTypes.length > 0
          ? formValues.aircraftTypes.map((option: Option) => option.value)
          : undefined,
      departureStations:
        formValues.departureStations.length > 0
          ? formValues.departureStations.map((option: Option) => option.value)
          : undefined,
      arrivalStations:
        formValues.arrivalStations.length > 0
          ? formValues.arrivalStations.map((option: Option) => option.value)
          : undefined,
    };
    onSearch(newFilter);
  };

  const handleReset = () => {
    setFormValues({
      startTime: '',
      endTime: '',
      flightNumbers: '',
      airlines: [],
      registrations: [],
      aircraftTypes: [],
      departureStations: [],
      arrivalStations: [],
    });
  };

  const panelBg = useColorModeValue('white', 'gray.800');
  const panelBorderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={panelBg}
      borderColor={panelBorderColor}
      borderWidth={1}
      borderRadius="md"
      p={4}
      boxShadow="lg"
      className="chakra-panel"
    >
      <form onSubmit={handleSearch}>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl mb={0.5}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                placeholder="Start Time"
                value={formValues.startTime}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={0.5}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                placeholder="End Time"
                value={formValues.endTime}
                onChange={handleInputChange}
              />
            </FormControl>
          </HStack>
          <FormControl mb={0.5}>
            <FormLabel>Flight Numbers</FormLabel>
            <Input
              type="text"
              name="flightNumbers"
              placeholder="Flight Numbers (comma separated)"
              value={formValues.flightNumbers}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Airlines</FormLabel>
            <MultiSelect
              name="airlines"
              options={airlines}
              placeholder="Select airlines..."
              value={formValues.airlines}
              onChange={(selectedOptions) => handleSelectChange('airlines', selectedOptions as Option[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Registrations</FormLabel>
            <MultiSelect
              name="registrations"
              options={registrations}
              placeholder="Select registrations..."
              value={formValues.registrations}
              onChange={(selectedOptions) => handleSelectChange('registrations', selectedOptions as Option[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Aircraft Types</FormLabel>
            <MultiSelect
              name="aircraftTypes"
              options={aircraftTypes}
              placeholder="Select aircraft types..."
              value={formValues.aircraftTypes}
              onChange={(selectedOptions) => handleSelectChange('aircraftTypes', selectedOptions as Option[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Departure Stations</FormLabel>
            <MultiSelect
              name="departureStations"
              options={departureStations}
              placeholder="Select departure stations..."
              value={formValues.departureStations}
              onChange={(selectedOptions) => handleSelectChange('departureStations', selectedOptions as Option[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Arrival Stations</FormLabel>
            <MultiSelect
              name="arrivalStations"
              options={arrivalStations}
              placeholder="Select arrival stations..."
              value={formValues.arrivalStations}
              onChange={(selectedOptions) => handleSelectChange('arrivalStations', selectedOptions as Option[])}
            />
          </FormControl>
          <HStack spacing={4}>
            <Button type="submit" colorScheme="brand">
              Search
            </Button>
            <Button type="button" onClick={handleReset}>
              Reset
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default FlightSearchForm;
