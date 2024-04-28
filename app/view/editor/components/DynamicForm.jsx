import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { CirclePlus, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function DynamicForm({ jsonData, onChange }) {
  const [formData, setFormData] = useState(jsonData);

  useEffect(() => {
    onChange(formData || jsonData);
  }, [formData, jsonData, onChange]);

  const renderFormFields = (data, parentKey = '') => {
    return Object.keys(data).map((key, index) => {
      const value = data[key];
      const inputType = Array.isArray(value) ? 'array' : 'text';

      if (inputType === 'array') {
        if (value.length === 0) return null;
        return (
          <div key={index} className='border-gray-600 border-2 rounded p-2 m-4'>
            {value.map((item, subIndex) => (
              <div key={subIndex} className='p-1 mb-1 rounded-md'>
                <label className='text-white text-lg'>
                  <i>
                    {parentKey ? `${parentKey}.${key}` : key} {subIndex + 1}
                  </i>
                </label>
                <span className='inline-block w-4' />
                <Button
                  size='icon'
                  className='mx-1'
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddArrayItem(key, value[0]);
                  }}
                >
                  <Plus />
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='mx-1'
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveArrayItem(key, subIndex);
                  }}
                >
                  <X />
                </Button>
                {renderFormFields(item, key)}
              </div>
            ))}
          </div>
        );
      }

      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      return (
        <div key={fullKey} className='relative z-0 w-full mb-5 group mt-2'>
          <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
          <Input
            type={inputType}
            name={fullKey}
            placeholder=' '
            required
            id={formData[fullKey]}
            value={formData[fullKey]}
            onChange={(e) => handleInputChange(fullKey, e.target.value)}
          />
        </div>
      );
    });
  };

  const handleInputChange = (key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const handleAddArrayItem = (key, newObject) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...(prevFormData[key] || []), newObject],
    }));
  };

  const handleRemoveArrayItem = (key, index) => {
    setFormData((prevFormData) => {
      const updatedArray = [...prevFormData[key]];
      updatedArray.splice(index, 1);
      return {
        ...prevFormData,
        [key]: updatedArray,
      };
    });
  };

  return <form>{renderFormFields(formData)}</form>;
}

export default DynamicForm;
