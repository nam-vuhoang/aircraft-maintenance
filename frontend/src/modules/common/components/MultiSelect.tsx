import React from 'react';
import Select from 'react-select';

export interface SelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  name: string;
  options: SelectOption[];
  placeholder: string;
  value: SelectOption[];
  onChange: (selectedOptions: SelectOption[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ name, options, placeholder, value, onChange }) => {
  return (
    <Select<SelectOption, true>
      isMulti
      name={name}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={(selected) => onChange(selected as SelectOption[])}
    />
  );
};

export default MultiSelect;
