import React, { useEffect, useState, useMemo } from 'react';
import { Box, Input, Button, VStack, HStack, FormControl, FormLabel, Select, Text } from '@chakra-ui/react';
import CategoryService from '../services/Category.service';
import { FlightFilter } from '../models/FlightFilter.dto';
import { WorkPackageFilter } from '../models';
import { MultiSelect, SelectOption } from '../modules/common';

interface AircraftTaskSearchFormProps {
  onSearch: (filters: { flightFilter: FlightFilter; workPackageFilter: WorkPackageFilter }) => void;
}

const AircraftTaskSearchForm: React.FC<AircraftTaskSearchFormProps> = ({ onSearch }) => {
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [stations, setStations] = useState<string[]>([]);

  const [formValues, setFormValues] = useState({
    startTime: '',
    endTime: '',
    registrations: [],
    stations: [],
    limitFlights: 'all',
    limitWorkPackages: 'all',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flightRegistrations, flightStations, workPackageRegistrations, workPackageStations] = await Promise.all([
          CategoryService.getFlightCategoryValues('registrations'),
          CategoryService.getFlightCategoryValues('stations'),
          CategoryService.getWorkPackageCategoryValues('registrations'),
          CategoryService.getWorkPackageCategoryValues('stations'),
        ]);

        setRegistrations(Array.from(new Set([...flightRegistrations, ...workPackageRegistrations])).sort());
        setStations(Array.from(new Set([...flightStations, ...workPackageStations])).sort());
      } catch (error) {
        console.error('Error fetching category values:', error);
      }
    };

    fetchData();
  }, []);

  const registrationOptions = useMemo(
    () => registrations.map((item) => ({ label: item, value: item })),
    [registrations]
  );
  const stationOptions = useMemo(() => stations.map((item) => ({ label: item, value: item })), [stations]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const commonValues = {
      startTime: formValues.startTime ? new Date(formValues.startTime) : undefined,
      endTime: formValues.endTime ? new Date(formValues.endTime) : undefined,
      registrations:
        formValues.registrations.length > 0
          ? formValues.registrations.map((option: SelectOption) => option.value)
          : undefined,
      stations:
        formValues.stations.length > 0 ? formValues.stations.map((option: SelectOption) => option.value) : undefined,
    };

    const workPackageFilter: WorkPackageFilter = {
      ...commonValues,
      limit: formValues.limitWorkPackages === 'all' ? undefined : Number(formValues.limitWorkPackages),
    };

    const flightFilter: FlightFilter = {
      ...commonValues,
      limit: formValues.limitFlights === 'all' ? undefined : Number(formValues.limitFlights),
    };

    onSearch({ flightFilter, workPackageFilter });
  };

  const handleReset = () => {
    setFormValues({
      startTime: '',
      endTime: '',
      registrations: [],
      stations: [],
      limitFlights: 'all',
      limitWorkPackages: 'all',
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
            <FormLabel>Stations</FormLabel>
            <MultiSelect
              name="stations"
              options={stationOptions}
              placeholder="Select stations..."
              value={formValues.stations}
              onChange={(selectedOptions) => handleSelectChange('stations', selectedOptions as SelectOption[])}
            />
          </FormControl>
          <HStack spacing={4}>
            <FormControl mb={0.5}>
              <FormLabel>Limit (Flights)</FormLabel>
              <Select name="limitFlights" value={formValues.limitFlights} onChange={handleInputChange}>
                <option value="0">0</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">All</option>
              </Select>
            </FormControl>
            <FormControl mb={0.5}>
              <FormLabel>Limit (Work Packages)</FormLabel>
              <Select name="limitWorkPackages" value={formValues.limitWorkPackages} onChange={handleInputChange}>
                <option value="0">0</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">All</option>
              </Select>
            </FormControl>
          </HStack>
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

export default AircraftTaskSearchForm;
