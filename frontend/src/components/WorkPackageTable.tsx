import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { WorkPackage } from '../models';
import { WarningPanel } from './utils';

interface WorkPackageTableProps {
  workPackages: WorkPackage[];
}

const WorkPackageTable: React.FC<WorkPackageTableProps> = ({ workPackages }) => {
  if (!workPackages.length) {
    return <WarningPanel message="No work package found. Update the search filter." />;
  }

  return (
    <Table className="chakra-table">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Area</Th>
          <Th>Registration</Th>
          <Th>Station</Th>
          <Th>Start Time</Th>
          <Th>End Time</Th>
        </Tr>
      </Thead>
      <Tbody>
        {workPackages.map((workPackage, index) => (
          <Tr key={index}>
            <Td>{workPackage.name}</Td>
            <Td>{workPackage.status}</Td>
            <Td>{workPackage.area}</Td>
            <Td>{workPackage.registration}</Td>
            <Td>{workPackage.station}</Td>
            <Td>{new Date(workPackage.startTime).toLocaleString()}</Td>
            <Td>{new Date(workPackage.endTime).toLocaleString()}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default WorkPackageTable;
