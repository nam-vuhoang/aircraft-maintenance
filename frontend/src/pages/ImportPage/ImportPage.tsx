import React, { useState, ChangeEvent } from 'react';
import { Box, Text, Input, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Flex } from '@chakra-ui/react';
import { FlightImportDto } from '../../models/FlightImport.dto';
import { FlightService, WorkPackageService } from '../../services';
import { WorkPackageDto } from '../../services/WorkPackage.dto';
import { AppStatusPanel, AppStatus, InfoPanel } from '../../components/utils';

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.response?.status === 400) {
          // Bad request
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.response?.status === 400) {
          // Bad request
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

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4}>
        Import Data
      </Text>

      <Tabs isFitted variant="enclosed">
        <TabList mb={4}>
          <Tab>Flights</Tab>
          <Tab>Work Packages</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex align="center" mb={4}>
              <Input type="file" accept=".json" onChange={(e) => handleFileChange(e, setFlightFile)} />
              <Button ml={4} onClick={handleImportFlights}>
                Import
              </Button>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex align="center" mb={4}>
              <Input type="file" accept=".json" onChange={(e) => handleFileChange(e, setWorkPackageFile)} />
              <Button ml={4} onClick={handleImportWorkPackages}>
                Import
              </Button>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {loading && <InfoPanel message="Loading data..." />}
      {status && <AppStatusPanel status={status} />}
    </Box>
  );
};

export default ImportPage;
