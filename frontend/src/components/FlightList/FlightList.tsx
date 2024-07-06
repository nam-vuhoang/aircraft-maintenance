import React, { useEffect, useState } from 'react';
import styles from './FlightList.module.scss';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Flight } from '../../models/Flight.entity';
import { FlightFilter } from '../../models/FlightFilter.dto';
import FlightService from '../../services/Flight.service';
import FlightSearchForm from '../FlightSearchForm/FlightSearchForm';

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

  const handleSearch = (newFilter: FlightFilter) => {
    setFilter(newFilter);
  };

  return (
    <Box className={styles.flightListContainer}>
      <Heading as="h1">Flight List</Heading>
      <FlightSearchForm onSearch={handleSearch} />
      <Table className={styles.colorfulTable}>
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
          {flights.map(flight => (
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
