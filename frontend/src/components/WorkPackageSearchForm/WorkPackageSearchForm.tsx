import React, { useState } from 'react';
import { Input, Button } from '@chakra-ui/react';
import { WorkPackageFilter } from '../../models/WorkPackageFilter.dto';

interface WorkPackageSearchFormProps {
  onSearch: (filter: WorkPackageFilter) => void;
}

const WorkPackageSearchForm: React.FC<WorkPackageSearchFormProps> = ({ onSearch }) => {
  const [formValues, setFormValues] = useState({
    startTime: '',
    endTime: '',
    registrations: '',
    stations: '',
    statuses: '',
    areas: '',
    namePattern: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const newFilter: WorkPackageFilter = {
      startTime: formValues.startTime ? new Date(formValues.startTime) : undefined,
      endTime: formValues.endTime ? new Date(formValues.endTime) : undefined,
      registrations: formValues.registrations ? formValues.registrations.split(',') : undefined,
      stations: formValues.stations ? formValues.stations.split(',') : undefined,
      statuses: formValues.statuses ? formValues.statuses.split(',') : undefined,
      areas: formValues.areas ? formValues.areas.split(',') : undefined,
      namePattern: formValues.namePattern || undefined,
    };
    onSearch(newFilter);
  };

  const handleReset = () => {
    setFormValues({
      startTime: '',
      endTime: '',
      registrations: '',
      stations: '',
      statuses: '',
      areas: '',
      namePattern: '',
    });
  };

  return (
    <form onSubmit={handleSearch}>
      <Input
        type="datetime-local"
        name="startTime"
        placeholder="Start Time"
        value={formValues.startTime}
        onChange={handleInputChange}
      />
      <Input
        type="datetime-local"
        name="endTime"
        placeholder="End Time"
        value={formValues.endTime}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        name="registrations"
        placeholder="Registrations (comma separated)"
        value={formValues.registrations}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        name="stations"
        placeholder="Stations (comma separated)"
        value={formValues.stations}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        name="statuses"
        placeholder="Statuses (comma separated)"
        value={formValues.statuses}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        name="areas"
        placeholder="Areas (comma separated)"
        value={formValues.areas}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        name="namePattern"
        placeholder="Name Pattern"
        value={formValues.namePattern}
        onChange={handleInputChange}
      />
      <Button type="submit">Search</Button>
      <Button type="button" onClick={handleReset}>
        Reset
      </Button>
    </form>
  );
};

export default WorkPackageSearchForm;
