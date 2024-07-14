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
import { FlightImportDto, WorkPackageImportDto } from '../models';
import { FlightService, WorkPackageService } from '../services';
import { AxiosError } from 'axios';
import { AppStatus, AppStatusPanel } from '../modules/common';

const ImportPage: React.FC = () => {
  const [flightFile, setFlightFile] = useState<File | null>(null);
  const [workPackageFile, setWorkPackageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<AppStatus | null>(null);

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
    setStatus({ info: 'Importing flights...' });

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const items: FlightImportDto[] = json;
        const importedCount = await FlightService.importFlights(items);
        setStatus({ success: `Successfully imported ${importedCount} flights.` });
      } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response?.status === 400) {
          const sample: FlightImportDto[] = [
            {
              flightId: 'b9ee236a-7e95-4bfd-a5ec-29b1220b898f',
              airline: 'QO',
              registration: 'ABA',
              aircraftType: 'AT7',
              flightNum: '8923',
              schedDepTime: '2024-04-16T16:55:00.000Z',
              schedArrTime: '2024-04-16T18:05:00.000Z',
              actualDepTime: '2024-04-16T17:08:00.000Z',
              actualArrTime: '2024-04-16T18:14:00.000Z',
              estimatedDepTime: '2024-04-16T17:05:00.000Z',
              estimatedArrTime: '2024-04-16T18:14:00.000Z',
              schedDepStation: 'HEL',
              schedArrStation: 'RIX',
              depStand: 'A2',
              origDepStand: 'A4',
            },
            {
              flightId: 'e49db842-f22e-4f8c-8450-72dbde0d7e15',
              airline: 'QO',
              registration: 'ABA',
              aircraftType: 'AT7',
              flightNum: '8922',
              schedDepTime: '2024-04-16T18:35:00.000Z',
              schedArrTime: '2024-04-16T19:45:00.000Z',
              actualDepTime: '2024-04-16T18:36:00.000Z',
              actualArrTime: '2024-04-16T19:45:00.000Z',
              estimatedDepTime: '2024-04-16T18:45:00.000Z',
              estimatedArrTime: '2024-04-16T19:47:00.000Z',
              schedDepStation: 'RIX',
              schedArrStation: 'HEL',
              arrStand: 'B3',
              origArrStand: 'A5',
            },
          ];
          setStatus({
            error: 'Invalid data format. Please check the file and try again.',
            info: (
              <pre>
                Sample data:
                <br />
                {JSON.stringify(sample, null, 2)}
              </pre>
            ),
          });
        } else {
          setStatus({ error });
        }
      }
    };
    reader.readAsText(flightFile);
  };

  const handleImportWorkPackages = async () => {
    if (!workPackageFile) {
      setStatus({ warning: 'Please select a file to import.' });
      return;
    }
    setStatus({ info: 'Importing work packages...' });

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const items: WorkPackageImportDto[] = json;
        const importedCount = await WorkPackageService.importWorkPackages(items);
        setStatus({ success: `Successfully imported ${importedCount} work packages.` });
      } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response?.status === 400) {
          const sample: WorkPackageImportDto[] = [
            {
              workPackageId: '19392169122587',
              name: 'ABA/A-20240416',
              station: 'HEL',
              status: 'OPEN',
              area: 'APRON',
              registration: 'ABA',
              startDateTime: '2024-04-16T08:00:00.000Z',
              endDateTime: '2024-04-16T09:30:00.000Z',
            },
            {
              workPackageId: '39051305650578',
              name: 'ABA/B-20240416',
              station: 'HEL',
              status: 'OPEN',
              area: 'APRON',
              registration: 'ABA',
              startDateTime: '2024-04-16T12:30:00.000Z',
              endDateTime: '2024-04-16T14:30:00.000Z',
            },
          ];

          setStatus({
            error: 'Invalid data format. Please check the file and try again.',
            info: (
              <pre>
                Sample data:
                <br /> {JSON.stringify(sample, null, 2)}
              </pre>
            ),
          });
        } else {
          setStatus({ error });
        }
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

      {status && <AppStatusPanel appStatus={status} mt={4} />}
    </Box>
  );
};

export default ImportPage;
