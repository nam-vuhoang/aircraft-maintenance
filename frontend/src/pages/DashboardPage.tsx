// src/pages/DashboardPage/DashboardPage.tsx
import { Box, Heading, HStack, Icon } from '@chakra-ui/react';
import { FaDatabase } from 'react-icons/fa';

const DashboardPage: React.FC = () => {
  return (
    <Box p={5}>
      <HStack mb={12}>
        <Heading className="chakra-page-heading">
          <Icon as={FaDatabase} w={8} h={8} mr={2} />
          Dashboard
        </Heading>
      </HStack>
    </Box>
  );
};

export default DashboardPage;
