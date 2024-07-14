import React, { useEffect, useState, useMemo } from 'react';
import { Box, Input, Button, VStack, HStack, FormControl, FormLabel, Select, Text } from '@chakra-ui/react';
import CategoryService from '../services/Category.service';
import { WorkPackageFilter } from '../models';
import { SelectOption, MultiSelect } from '../modules/common';

interface WorkPackageSearchFormProps {
  onSearch: (filter: WorkPackageFilter) => void;
}

const WorkPackageSearchForm: React.FC<WorkPackageSearchFormProps> = ({ onSearch }) => {
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [stations, setStations] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  const [formValues, setFormValues] = useState({
    startTime: '',
    endTime: '',
    registrations: [],
    stations: [],
    statuses: [],
    areas: [],
    namePattern: '',
    limit: '25',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrationsData, stationsData, statusesData, areasData] = await Promise.all([
          CategoryService.getWorkPackageCategoryValues('registrations'),
          CategoryService.getWorkPackageCategoryValues('stations'),
          CategoryService.getWorkPackageCategoryValues('statuses'),
          CategoryService.getWorkPackageCategoryValues('areas'),
        ]);

        setRegistrations(registrationsData);
        setStations(stationsData);
        setStatuses(statusesData);
        setAreas(areasData);
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
  const statusOptions = useMemo(() => statuses.map((item) => ({ label: item, value: item })), [statuses]);
  const areaOptions = useMemo(() => areas.map((item) => ({ label: item, value: item })), [areas]);

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
    const newFilter: WorkPackageFilter = {
      startTime: formValues.startTime ? new Date(formValues.startTime) : undefined,
      endTime: formValues.endTime ? new Date(formValues.endTime) : undefined,
      registrations:
        formValues.registrations.length > 0
          ? formValues.registrations.map((option: SelectOption) => option.value)
          : undefined,
      stations: formValues.stations.length > 0 ? formValues.stations.map((option: SelectOption) => option.value) : undefined,
      statuses: formValues.statuses.length > 0 ? formValues.statuses.map((option: SelectOption) => option.value) : undefined,
      areas: formValues.areas.length > 0 ? formValues.areas.map((option: SelectOption) => option.value) : undefined,
      namePattern: formValues.namePattern || undefined,
      limit: formValues.limit === 'all' ? undefined : Number(formValues.limit),
    };
    onSearch(newFilter);
  };

  const handleReset = () => {
    setFormValues({
      startTime: '',
      endTime: '',
      registrations: [],
      stations: [],
      statuses: [],
      areas: [],
      namePattern: '',
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
          <FormControl mb={0.5}>
            <FormLabel>Statuses</FormLabel>
            <MultiSelect
              name="statuses"
              options={statusOptions}
              placeholder="Select statuses..."
              value={formValues.statuses}
              onChange={(selectedOptions) => handleSelectChange('statuses', selectedOptions as SelectOption[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Areas</FormLabel>
            <MultiSelect
              name="areas"
              options={areaOptions}
              placeholder="Select areas..."
              value={formValues.areas}
              onChange={(selectedOptions) => handleSelectChange('areas', selectedOptions as SelectOption[])}
            />
          </FormControl>
          <FormControl mb={0.5}>
            <FormLabel>Name Pattern</FormLabel>
            <Input
              type="text"
              name="namePattern"
              placeholder="Name Pattern"
              value={formValues.namePattern}
              onChange={handleInputChange}
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

export default WorkPackageSearchForm;
