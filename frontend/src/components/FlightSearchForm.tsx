import React, { useEffect, useState, useMemo } from 'react';
import { Box, Input, Button, VStack, HStack, FormControl, FormLabel, Select, Text } from '@chakra-ui/react';
import CategoryService from '../services/Category.service';
import { FlightFilter } from '../models/FlightFilter.dto';
import { MultiSelect, SelectOption } from '../modules/common';

interface FlightSearchFormProps {
  onSearch: (filter: FlightFilter) => void;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch }) => {
  const [airlines, setAirlines] = useState<string[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [aircraftTypes, setAircraftTypes] = useState<string[]>([]);
  const [stations, setStations] = useState<string[]>([]);

  const [formValues, setFormValues] = useState({
    startTime: '',
    endTime: '',
    flightNumbers: '',
    airlines: [],
    registrations: [],
    aircraftTypes: [],
    departureStations: [],
    arrivalStations: [],
    limit: '25',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airlinesData, registrationsData, aircraftTypesData, stationsData] = await Promise.all([
          CategoryService.getFlightCategoryValues('airlines'),
          CategoryService.getFlightCategoryValues('registrations'),
          CategoryService.getFlightCategoryValues('aircraftTypes'),
          CategoryService.getFlightCategoryValues('stations'),
        ]);

        setAirlines(airlinesData);
        setRegistrations(registrationsData);
        setAircraftTypes(aircraftTypesData);
        setStations(stationsData);
      } catch (error) {
        console.error('Error fetching category values:', error);
      }
    };

    fetchData();
  }, []);

  const airlineOptions = useMemo(() => airlines.map((item) => ({ label: item, value: item })), [airlines]);
  const registrationOptions = useMemo(
    () => registrations.map((item) => ({ label: item, value: item })),
    [registrations]
  );
  const aircraftTypeOptions = useMemo(
    () => aircraftTypes.map((item) => ({ label: item, value: item })),
    [aircraftTypes]
  );
  const stationOptions = useMemo(() => stations.map((item) => ({ label: item, value: item })), [stations]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: SelectOption[]) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      limit: value,
    }));
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const newFilter: FlightFilter = {
      startTime: formValues.startTime ? new Date(formValues.startTime) : undefined,
      endTime: formValues.endTime ? new Date(formValues.endTime) : undefined,
      flightNumbers: formValues.flightNumbers ? formValues.flightNumbers.split(',') : undefined,
      airlines:
        formValues.airlines.length > 0 ? formValues.airlines.map((option: SelectOption) => option.value) : undefined,
      registrations:
        formValues.registrations.length > 0
          ? formValues.registrations.map((option: SelectOption) => option.value)
          : undefined,
      aircraftTypes:
        formValues.aircraftTypes.length > 0
          ? formValues.aircraftTypes.map((option: SelectOption) => option.value)
          : undefined,
      departureStations:
        formValues.departureStations.length > 0
          ? formValues.departureStations.map((option: SelectOption) => option.value)
          : undefined,
      arrivalStations:
        formValues.arrivalStations.length > 0
          ? formValues.arrivalStations.map((option: SelectOption) => option.value)
          : undefined,
      limit: formValues.limit === 'all' ? undefined : Number(formValues.limit),
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
      limit: '25',
    });
  };

  return (
    <Box borderWidth={1} borderRadius="md" p={4} boxShadow="lg" className="chakra-panel">
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
              options={airlineOptions}
              placeholder="Select airlines..."
              value={formValues.airlines}
              onChange={(selectedOptions) => handleSelectChange('airlines', selectedOptions as SelectOption[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Registrations</FormLabel>
            <MultiSelect
              name="registrations"
              options={registrationOptions}
              placeholder="Select registrations..."
              value={formValues.registrations}
              onChange={(selectedOptions) => handleSelectChange('registrations', selectedOptions as SelectOption[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Aircraft Types</FormLabel>
            <MultiSelect
              name="aircraftTypes"
              options={aircraftTypeOptions}
              placeholder="Select aircraft types..."
              value={formValues.aircraftTypes}
              onChange={(selectedOptions) => handleSelectChange('aircraftTypes', selectedOptions as SelectOption[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Departure Stations</FormLabel>
            <MultiSelect
              name="departureStations"
              options={stationOptions}
              placeholder="Select departure stations..."
              value={formValues.departureStations}
              onChange={(selectedOptions) => handleSelectChange('departureStations', selectedOptions as SelectOption[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Arrival Stations</FormLabel>
            <MultiSelect
              name="arrivalStations"
              options={stationOptions}
              placeholder="Select arrival stations..."
              value={formValues.arrivalStations}
              onChange={(selectedOptions) => handleSelectChange('arrivalStations', selectedOptions as SelectOption[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Limit</FormLabel>
            <Select name="limit" value={formValues.limit} onChange={handleLimitChange}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </Select>
          </FormControl>
          <Text fontSize="sm" color="red.300">
            Warning: Pagination is currently not supported.
          </Text>
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
