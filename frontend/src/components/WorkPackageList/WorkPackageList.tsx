import React, { useEffect, useState } from 'react';
import styles from './WorkPackageList.module.scss';
import { Input, Button, Table, Thead, Tbody, Tr, Th, Td, Box, Heading } from '@chakra-ui/react';
import { WorkPackage } from '../../models/WorkPackage.entity';
import { WorkPackageFilter } from '../../models/WorkPackageFilter.dto';
import WorkPackageService from '../../services/WorkPackage.service';

const WorkPackageList: React.FC = () => {
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>([]);
  const [filter, setFilter] = useState<WorkPackageFilter>({});

  useEffect(() => {
    const fetchWorkPackages = async () => {
      try {
        const response = await WorkPackageService.searchWorkPackages(filter);
        setWorkPackages(response);
      } catch (error) {
        console.error('Error fetching work packages:', error);
      }
    };

    fetchWorkPackages();
  }, [filter]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const newFilter: WorkPackageFilter = {
      startTime: formData.get('startTime') as unknown as Date,
      endTime: formData.get('endTime') as unknown as Date,
      registrations: formData.get('registrations') ? (formData.get('registrations') as string).split(',') : undefined,
      stations: formData.get('stations') ? (formData.get('stations') as string).split(',') : undefined,
      statuses: formData.get('statuses') ? (formData.get('statuses') as string).split(',') : undefined,
      areas: formData.get('areas') ? (formData.get('areas') as string).split(',') : undefined,
      namePattern: formData.get('namePattern') as string,
    };
    setFilter(newFilter);
  };

  return (
    <Box className={styles.workPackageListContainer}>
      <Heading as="h1">Work Package List</Heading>
      <form onSubmit={handleSearch}>
        <Input type="datetime-local" name="startTime" placeholder="Start Time" />
        <Input type="datetime-local" name="endTime" placeholder="End Time" />
        <Input type="text" name="registrations" placeholder="Registrations (comma separated)" />
        <Input type="text" name="stations" placeholder="Stations (comma separated)" />
        <Input type="text" name="statuses" placeholder="Statuses (comma separated)" />
        <Input type="text" name="areas" placeholder="Areas (comma separated)" />
        <Input type="text" name="namePattern" placeholder="Name Pattern" />
        <Button type="submit">Search</Button>
      </form>
      <Table>
        <Thead>
          <Tr>
            <Th>Registration</Th>
            <Th>Name</Th>
            <Th>Station</Th>
            <Th>Status</Th>
            <Th>Area</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {workPackages.map((workPackage) => (
            <Tr key={workPackage.id}>
              <Td>{workPackage.registration}</Td>
              <Td>{workPackage.name}</Td>
              <Td>{workPackage.station}</Td>
              <Td>{workPackage.status}</Td>
              <Td>{workPackage.area}</Td>
              <Td>{new Date(workPackage.startTime).toLocaleString()}</Td>
              <Td>{new Date(workPackage.endTime).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default WorkPackageList;
