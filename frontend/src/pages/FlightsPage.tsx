import { Box, Heading, HStack, Icon } from '@chakra-ui/react';
import React from 'react';
import { FaDatabase } from 'react-icons/fa';
import FlightList from '../components/FlightList/FlightList';

const FlightsPage: React.FC = () => {
  return (
    <Box p={5}>
      <HStack mb={12}>
        <Heading className="chakra-page-heading">
          <Icon as={FaDatabase} w={8} h={8} mr={2} />
          Flights
        </Heading>
      </HStack>

      <FlightList />

    </Box>
  );
};

export default FlightsPage;
