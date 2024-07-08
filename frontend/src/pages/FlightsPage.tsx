import { Box, Heading, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaDatabase } from 'react-icons/fa';
import FlightSearchForm from '../components/FlightSearchForm/FlightSearchForm';
import FlightTable from '../components/FlightTable';
import { Flight, FlightFilter } from '../models';
import { FlightService } from '../services';

const FlightsPage: React.FC = () => {
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
    <Box p={5}>
      <HStack mb={12}>
        <Heading className="chakra-page-heading">
          <Icon as={FaDatabase} w={8} h={8} mr={2} />
          Flights
        </Heading>
      </HStack>

      <Box className="chakra-panel">
        <Heading as="h1" size="lg" mb={4}>
          Search flights
        </Heading>
        <FlightSearchForm onSearch={handleSearch} />
      </Box>

      <Box className="chakra-panel" mt={4}>
        <Heading as="h1" size="lg" mb={4}>
          Flights
        </Heading>
        <FlightTable flights={flights} />
      </Box>
    </Box>
  );
};

export default FlightsPage;
