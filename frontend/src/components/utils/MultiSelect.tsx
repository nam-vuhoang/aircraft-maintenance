// src/MultiSelect.tsx
import React from 'react';
import Select from 'react-select';

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  name: string;
  options: Option[];
  placeholder: string;
  value: Option[];
  onChange: (selectedOptions: Option[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ name, options, placeholder, value, onChange }) => {
  return (
    <Select<Option, true>
      isMulti
      name={name}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={(selected) => onChange(selected as Option[])}
    />
  );
};

export default MultiSelect;
