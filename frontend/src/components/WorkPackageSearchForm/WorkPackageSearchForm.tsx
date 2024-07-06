import React from 'react';
import { Input, Button } from '@chakra-ui/react';
import { WorkPackageFilter } from '../../models/WorkPackageFilter.dto';

interface WorkPackageSearchFormProps {
  onSearch: (filter: WorkPackageFilter) => void;
}

const WorkPackageSearchForm: React.FC<WorkPackageSearchFormProps> = ({ onSearch }) => {
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const newFilter = {
      startTime: formData.get('startTime') ? new Date(formData.get('startTime')!.toString()) : undefined,
      endTime: formData.get('endTime') ? new Date(formData.get('endTime')!.toString()) : undefined,
      registrations: formData.get('registrations') ? formData.get('registrations')!.toString().split(',') : undefined,
      stations: formData.get('stations') ? formData.get('stations')!.toString().split(',') : undefined,
      statuses: formData.get('statuses') ? formData.get('statuses')!.toString().split(',') : undefined,
      areas: formData.get('areas') ? formData.get('areas')!.toString().split(',') : undefined,
      namePattern: formData.get('namePattern') ? formData.get('namePattern')!.toString() : undefined,
    };
    onSearch(newFilter);
  };

  return (
    <form onSubmit={handleSearch}>
      <Input type="datetime-local" name="startTime" placeholder="Start Time" />
      <Input type="datetime-local" name="endTime" placeholder="End Time" />
      <Input type="text" name="registrations" placeholder="Registrations (comma separated)" />
      <Input type="text" name="stations" placeholder="Stations (comma separated)" />
      <Input type="text" name="statuses" placeholder="Statuses (comma separated)" />
      <Input type="text" name="areas" placeholder="Areas (comma separated)" />
      <Input type="text" name="namePattern" placeholder="Name Pattern" />
      <Button type="submit">Search</Button>
    </form>
  );
};

export default WorkPackageSearchForm;
