import { Box, Heading, HStack, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import WorkPackageSearchForm from '../components/WorkPackageSearchForm';
import { WorkPackage, WorkPackageFilter } from '../models';
import { WorkPackageService } from '../services';
import { AppStatus, AppStatusPanel } from '../components/utils';
import { MdBuild } from 'react-icons/md';
import WorkPackageTable from '../components/WorkPackageTable';

const WorkPackagePage: React.FC = () => {
  const [workPackages, setWorkPackages] = useState<WorkPackage[] | undefined>(undefined);
  const [status, setStatus] = useState<AppStatus | null>(null);

  const handleSearch = async (filter: WorkPackageFilter) => {
    try {
      setStatus({ info: 'Fetching work packages...' });
      const response = await WorkPackageService.searchWorkPackages(filter);
      setWorkPackages(response);
      setStatus(null);
    } catch (error: unknown) {
      setStatus({ error: error as Error });
    }
  };

  return (
    <Box p={5}>
      <HStack mb={12}>
        <Heading className="chakra-page-heading">
          <Icon as={MdBuild} w={8} h={8} mr={2} />
          Work Packages
        </Heading>
      </HStack>

      <Box className="chakra-panel">
        <Heading as="h1" size="lg" mb={4}>
          Search work packages
        </Heading>
        <WorkPackageSearchForm onSearch={handleSearch} />
      </Box>

      {workPackages && (
        <Box className="chakra-panel" mt={8}>
          <Heading as="h1" size="lg" mb={4}>
            Work Packages
          </Heading>
          <WorkPackageTable workPackages={workPackages} />
        </Box>
      )}

      {status && (
        <Box mt={4}>
          <AppStatusPanel status={status} />
        </Box>
      )}
    </Box>
  );
};

export default WorkPackagePage;
