import React from 'react';
import { Box, VStack, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { FaDatabase } from 'react-icons/fa';
import ImportPage from './pages/ImportPage';
import DashboardPage from './pages/DashboardPage';
import FlightsPage from './pages/FlightsPage';
import { MdBuild, MdDashboard, MdFlightTakeoff } from 'react-icons/md';
import WorkPackagePage from './pages/WorkPackagesPage';

const App: React.FC = () => {
  const activeLinkColor = useColorModeValue('brand.500', 'brand.200');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const sidebarBorderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('secondaryGray.300', 'gray.700');

  return (
    <Box display="flex">
      <Box
        className="chakra-sidebar"
        mr={4}
        bg={sidebarBg}
        borderColor={sidebarBorderColor}
        borderWidth={1}
        borderRadius="md"
        p={4}
      >
        <VStack spacing={4} align="stretch">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? activeLinkColor : 'inherit',
            })}
          >
            <HStack>
              <Box w={5} h={5} as={MdDashboard} bg={iconBg} borderRadius="md" title="Dashboard" />
              <Text>Dashboard</Text>
            </HStack>
          </NavLink>
          <NavLink
            to="/flights"
            style={({ isActive }) => ({
              color: isActive ? activeLinkColor : 'inherit',
            })}
          >
            <HStack>
              <Box w={5} h={5} as={MdFlightTakeoff} bg={iconBg} borderRadius="md" title="Flights" />
              <Text>Flights</Text>
            </HStack>
          </NavLink>
          <NavLink
            to="/work-packages"
            style={({ isActive }) => ({
              color: isActive ? activeLinkColor : 'inherit',
            })}
          >
            <HStack>
              <Box w={5} h={5} as={MdBuild} bg={iconBg} borderRadius="md" title="Flights" />
              <Text>Work Packages</Text>
            </HStack>
          </NavLink>
          <NavLink
            to="/import"
            style={({ isActive }) => ({
              color: isActive ? activeLinkColor : 'inherit',
            })}
          >
            <HStack>
              <Box w={5} h={5} as={FaDatabase} bg={iconBg} borderRadius="md" title="Import" />
              <Text>Import</Text>
            </HStack>
          </NavLink>
          <Box flex={1}>&nbsp;</Box>
        </VStack>
      </Box>
      <Box flex="1" p={4}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/work-packages" element={<WorkPackagePage />} />
          <Route path="/import" element={<ImportPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
