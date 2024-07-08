import React, { useEffect, useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue } from '@chakra-ui/react';
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

  const panelBg = useColorModeValue('white', 'gray.800');
  const panelBorderColor = useColorModeValue('gray.200', 'gray.700');
  const tableHeaderBg = useColorModeValue('gray.100', 'gray.900');
  const tableRowOddBg = useColorModeValue('gray.50', 'gray.700');
  const tableRowEvenBg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={panelBg} borderColor={panelBorderColor} borderWidth={1} borderRadius="md" p={4} boxShadow="lg">
      <Heading as="h2" size="lg" mb={4}>
        Flight Search Form
      </Heading>
      <FlightSearchForm onSearch={handleSearch} />
      <Table variant="simple" size="sm" mt={4} border="1px" borderColor={panelBorderColor}>
        <Thead bg={tableHeaderBg}>
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
          {flights.map((flight, index) => (
            <Tr key={flight.id} bg={index % 2 === 0 ? tableRowEvenBg : tableRowOddBg}>
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
