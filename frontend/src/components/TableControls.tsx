import { useState } from 'react';
import { 
  Paper, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton, 
  Box, 
  Typography,
  Chip
} from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import type { TableFilters } from '../types';
import { ArticleStatus } from '../types';

interface TableControlsProps {
  filters: TableFilters;
  onFiltersChange: (filters: Partial<TableFilters>) => void;
  onClearFilters: () => void;
  totalItems: number;
  filteredItems: number;
}

export function TableControls({
  filters,
  onFiltersChange,
  onClearFilters,
  totalItems,
  filteredItems
}: TableControlsProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ search: searchInput });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // Búsqueda en tiempo real con debounce
    if (value.length === 0 || value.length > 2) {
      onFiltersChange({ search: value });
    }
  };

  const getStatusLabel = (status: ArticleStatus) => {
    const labels: Record<ArticleStatus, string> = {
      [ArticleStatus.VALIDO]: 'Válido',
      [ArticleStatus.INVALIDO]: 'Inválido',
      [ArticleStatus.PENDIENTE]: 'Pendiente'
    };
    return labels[status];
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Fila superior: Búsqueda y filtros */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Campo de búsqueda */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ flexGrow: 1, minWidth: 250 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre o país..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchInput && (
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      setSearchInput('');
                      onFiltersChange({ search: '' });
                    }}
                  >
                    <Clear />
                  </IconButton>
                )
              }}
            />
          </Box>

          {/* Filtro por estado */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.status}
              label="Estado"
              onChange={(e) => onFiltersChange({ status: e.target.value as ArticleStatus | '' })}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.values(ArticleStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {getStatusLabel(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Botón limpiar filtros */}
          <IconButton 
            onClick={onClearFilters}
            disabled={!filters.search && !filters.status && !filters.sortBy}
            title="Limpiar filtros"
          >
            <Clear />
          </IconButton>
        </Box>

        {/* Fila inferior: Información y filtros activos */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Mostrando {filteredItems.toLocaleString()} de {totalItems.toLocaleString()} artículos
          </Typography>

          {/* Filtros activos */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.search && (
              <Chip
                size="small"
                label={`Búsqueda: "${filters.search}"`}
                onDelete={() => {
                  setSearchInput('');
                  onFiltersChange({ search: '' });
                }}
                deleteIcon={<Clear />}
              />
            )}
            {filters.status && (
              <Chip
                size="small"
                label={`Estado: ${getStatusLabel(filters.status as ArticleStatus)}`}
                onDelete={() => onFiltersChange({ status: '' })}
                deleteIcon={<Clear />}
              />
            )}
            {filters.sortBy && (
              <Chip
                size="small"
                label={`Orden: ${filters.sortBy === 'date' ? 'Fecha' : 'Monto'} ${filters.sortOrder === 'asc' ? '↑' : '↓'}`}
                onDelete={() => onFiltersChange({ sortBy: '', sortOrder: 'asc' })}
                deleteIcon={<Clear />}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
