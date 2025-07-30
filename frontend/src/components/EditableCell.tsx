import React, { useState, useEffect, useRef } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import { Check, Close } from '@mui/icons-material';

interface EditableCellProps {
  value: string | number;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (value: string | number) => void;
  onCancel: () => void;
  type?: 'text' | 'number';
  displayValue?: string;
}

export function EditableCell({
  value,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  type = 'text',
  displayValue
}: EditableCellProps) {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Usar setTimeout para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          if (inputRef.current.select) {
            inputRef.current.select();
          }
        }
      }, 0);
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
      setEditValue(isNaN(numValue) ? 0 : numValue);
    } else {
      setEditValue(e.target.value);
    }
  };

  const handleSave = () => {
    onSave(editValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
        <TextField
          ref={inputRef}
          value={editValue}
          onChange={handleValueChange}
          onKeyDown={handleKeyPress}
          type={type}
          size="small"
          variant="outlined"
          sx={{ flexGrow: 1 }}
        />
        <IconButton size="small" onClick={handleSave} color="primary">
          <Check />
        </IconButton>
        <IconButton size="small" onClick={onCancel} color="secondary">
          <Close />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box 
      onClick={onStartEdit} 
      sx={{ 
        cursor: 'pointer', 
        padding: '4px 8px',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    >
      {displayValue || value}
    </Box>
  );
}
