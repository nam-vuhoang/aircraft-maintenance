import { Box, Heading, HStack, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Flight, FlightFilter, WorkPackage, WorkPackageFilter } from '../models';
import { FlightService, WorkPackageService } from '../services';
import { MdDashboard } from 'react-icons/md'; // Change the icon to MdDashboard
import { AppStatus, AppStatusPanel } from '../modules/common';
import { AircraftGanttChart, AircraftTaskSearchForm } from '../components';

const DashboardPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[] | undefined>(undefined);
  const [workPackages, setWorkPackages] = useState<WorkPackage[] | undefined>(undefined);
  const [status, setStatus] = useState<AppStatus | null>(null);

  const handleSearch = async ({
    flightFilter,
    workPackageFilter,
  }: {
    flightFilter: FlightFilter;
    workPackageFilter: WorkPackageFilter;
  }) => {
    try {
      setStatus({ info: 'Fetching flights and work packages...' });
      const [flights, workPackages] = await Promise.all([
        FlightService.searchFlights(flightFilter),
        WorkPackageService.searchWorkPackages(workPackageFilter),
      ]);
      setFlights(flights);
      setWorkPackages(workPackages);
      setStatus(null);
    } catch (error: unknown) {
      setStatus({ error: error as Error });
    }
  };

  return (
    <Box p={5}>
      <HStack mb={12}>
        <Heading className="chakra-page-heading">
          <Icon as={MdDashboard} w={8} h={8} mr={2} /> {/* Use the MdDashboard icon */}
          Dashboard
        </Heading>
      </HStack>

      <Box className="chakra-panel">
        <Heading as="h1" size="lg" mb={4}>
          Search Flights & Work Packages
        </Heading>
        <AircraftTaskSearchForm onSearch={handleSearch} />
      </Box>

      {flights && workPackages && (
        <Box className="chakra-panel" mt={8}>
          <Heading as="h1" size="lg" mb={4}>
            Flights & Work Packages
          </Heading>
          <AircraftGanttChart flights={flights} workPackages={workPackages} />
        </Box>
      )}

      {status && <AppStatusPanel appStatus={status} mt={4} />}
    </Box>
  );
};

export default DashboardPage;
