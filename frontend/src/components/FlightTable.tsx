import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Flight } from '../models/Flight.entity';

interface FlightTableProps {
  flights: Flight[];
}

const FlightTable: React.FC<FlightTableProps> = ({ flights }) => {
  return (
    <Table className="chakra-table">
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
        {flights.map((flight, index) => (
          <Tr key={index}>
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
  );
};

export default FlightTable;
