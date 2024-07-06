import React, { useEffect, useState } from 'react';
import styles from './FlightList.module.scss';
import { Input, Button, Table, Thead, Tbody, Tr, Th, Td, Box, Heading } from '@chakra-ui/react';
import { Flight } from '../../models/Flight.entity';
import { FlightFilter } from '../../models/FlightFilter.dto';
import FlightService from '../../services/Flight.service';

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filter, setFilter] = useState<FlightFilter>({});

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await FlightService.searchFlights(filter);
        setFlights(response);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, [filter]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const newFilter: FlightFilter = {
      startTime: formData.get('startTime') as unknown as Date,
      endTime: formData.get('endTime') as unknown as Date,
      flightNumbers: formData.get('flightNumbers') ? (formData.get('flightNumbers') as string).split(',') : undefined,
      airlines: formData.get('airlines') ? (formData.get('airlines') as string).split(',') : undefined,
      registrations: formData.get('registrations') ? (formData.get('registrations') as string).split(',') : undefined,
      aircraftTypes: formData.get('aircraftTypes') ? (formData.get('aircraftTypes') as string).split(',') : undefined,
      departureStations: formData.get('departureStations')
        ? (formData.get('departureStations') as string).split(',')
        : undefined,
      arrivalStations: formData.get('arrivalStations')
        ? (formData.get('arrivalStations') as string).split(',')
        : undefined,
    };
    setFilter(newFilter);
  };

  return (
    <Box className={styles.flightListContainer}>
      <Heading as="h1">Flight List</Heading>
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
      <Table>
        <Thead>
          <Tr>
            <Th>Airline</Th>
            <Th>Flight Number</Th>
            <Th>Registration</Th>
            <Th>Aircraft Type</Th>
            <Th>Departure Station</Th>
            <Th>Arrival Station</Th>
            <Th>Scheduled Departure Time</Th>
            <Th>Scheduled Arrival Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {flights.map((flight) => (
            <Tr key={flight.id}>
              <Td>{flight.airline}</Td>
              <Td>{flight.flightNumber}</Td>
              <Td>{flight.registration}</Td>
              <Td>{flight.aircraftType}</Td>
              <Td>{flight.scheduledDepartureStation}</Td>
              <Td>{flight.scheduledArrivalStation}</Td>
              <Td>{new Date(flight.scheduledDepartureTime).toLocaleString()}</Td>
              <Td>{new Date(flight.scheduledArrivalTime).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default FlightList;
