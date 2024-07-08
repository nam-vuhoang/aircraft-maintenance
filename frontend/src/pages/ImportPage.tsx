import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Input,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Heading,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaDatabase } from 'react-icons/fa';
import { FlightImportDto } from '../models/FlightImport.dto';
import { FlightService, WorkPackageService } from '../services';
import { WorkPackageDto } from '../services/WorkPackage.dto';
import { AppStatusPanel, AppStatus, InfoPanel } from '../components/utils';

const ImportPage: React.FC = () => {
  const [flightFile, setFlightFile] = useState<File | null>(null);
  const [workPackageFile, setWorkPackageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setFile(e.target.files ? e.target.files[0] : null);
    setStatus(null);
  };

  const handleImportFlights = async () => {
    if (!flightFile) {
      setStatus({ warning: 'Please select a file to import.' });
      return;
    }
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const items: FlightImportDto[] = json;
        const importedCount = await FlightService.importFlights(items);
        setStatus({ success: `Successfully imported ${importedCount} flights.` });
      } catch (err: any) {
        if (err.response?.status === 400) {
          setStatus({ error: 'Invalid data format. Please check the file and try again.' });
        } else {
          setStatus({ error: err });
        }
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(flightFile);
  };

  const handleImportWorkPackages = async () => {
    if (!workPackageFile) {
      setStatus({ warning: 'Please select a file to import.' });
      return;
    }
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const items: WorkPackageDto[] = json;
        const importedCount = await WorkPackageService.importWorkPackages(items);
        setStatus({ success: `Successfully imported ${importedCount} work packages.` });
      } catch (err: any) {
        if (err.response?.status === 400) {
          setStatus({ error: 'Invalid data format. Please check the file and try again.' });
        } else {
          setStatus({ error: err });
        }
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(workPackageFile);
  };

  const panelBg = useColorModeValue('white', 'gray.800');
  const panelBorderColor = useColorModeValue('gray.200', 'gray.700');
  const activeTabColor = useColorModeValue('brand.500', 'brand.200');
  const activeTabBg = useColorModeValue('brand.50', 'gray.700');

  return (
    <Box p={5}>
      <HStack mb={12}>
        <Heading className="chakra-page-heading">
          <Icon as={FaDatabase} w={8} h={8} mr={2} />
          Import Data
        </Heading>
      </HStack>

      <Box className="chakra-panel">
        <Tabs isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab
              _selected={{
                color: activeTabColor,
                bg: activeTabBg,
                borderRadius: 'md',
                fontWeight: 'bold',
              }}
            >
              Flights
            </Tab>
            <Tab
              _selected={{
                color: activeTabColor,
                bg: activeTabBg,
                borderRadius: 'md',
                fontWeight: 'bold',
              }}
            >
              Work Packages
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box bg={panelBg} borderColor={panelBorderColor} borderWidth={1} borderRadius="md" p={4}>
                <Flex align="center" mb={4}>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileChange(e, setFlightFile)}
                    display="flex"
                    alignItems="center"
                    p={2}
                    h={12}
                  />
                  <Button ml={4} onClick={handleImportFlights} colorScheme="brand">
                    Import
                  </Button>
                </Flex>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box bg={panelBg} borderColor={panelBorderColor} borderWidth={1} borderRadius="md" p={4}>
                <Flex align="center" mb={4}>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileChange(e, setWorkPackageFile)}
                    display="flex"
                    alignItems="center"
                    p={2}
                    h={12}
                  />
                  <Button ml={4} onClick={handleImportWorkPackages} colorScheme="brand">
                    Import
                  </Button>
                </Flex>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {loading && <InfoPanel message="Loading data..." mt={4} />}
      {status && (
        <Box mt={4}>
          <AppStatusPanel status={status} />
        </Box>
      )}
    </Box>
  );
};

export default ImportPage;
