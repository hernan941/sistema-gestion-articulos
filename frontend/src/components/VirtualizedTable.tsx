import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { 
  Paper, 
  TableSortLabel,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Alert
} from '@mui/material';
import type { Article, TableFilters, ValidationWarning } from '../types';
import { ArticleStatus } from '../types';
import { EditableCell } from './EditableCell';
import { WarningIndicator } from './WarningIndicator';
import { formatDate, formatAmount, formatAmountUSD, decryptName } from '../utils/dataUtils';
import EditIcon from '@mui/icons-material/Edit';

interface VirtualizedTableProps {
  data: Article[];
  filters: TableFilters;
  warnings: Map<string, ValidationWarning[]>;
  editingCell: { id: string; field: 'name' | 'originalAmount'; value: string | number } | null;
  onSort: (field: 'date' | 'originalAmount') => void;
  onStartEdit: (id: string, field: 'name' | 'originalAmount') => void;
  onSaveEdit: (value: string | number) => void;
  onCancelEdit: () => void;
}

// Definir las columnas con sus anchos
const COLUMNS = [
  { key: 'id', label: 'ID', width: '120px', sortable: false },
  { key: 'date', label: 'Fecha', width: '150px', sortable: true },
  { key: 'name', label: 'Nombre', width: '300px', sortable: false },
  { key: 'originalAmount', label: 'Monto', width: '220px', sortable: true },
  { key: 'amountUSD', label: 'Monto USD', width: '180px', sortable: false },
  { key: 'country', label: 'País', width: '140px', sortable: false },
  { key: 'agentType', label: 'Agente/Tipo', width: '140px', sortable: false },
  { key: 'status', label: 'Estado', width: '120px', sortable: false },
  { key: 'warnings', label: 'Alertas', width: '80px', sortable: false },
] as const;

export function VirtualizedTable({ 
  data, 
  filters, 
  warnings,
  editingCell,
  onSort, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit 
}: VirtualizedTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Ref para el contenedor padre
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Configuración del virtualizador
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isMobile ? 230 : 60),
    overscan: 3,
  });

  const getStatusColor = (status: ArticleStatus): 'success' | 'error' | 'warning' => {
    const colors: Record<ArticleStatus, 'success' | 'error' | 'warning'> = {
      [ArticleStatus.VALIDO]: 'success',
      [ArticleStatus.INVALIDO]: 'error',
      [ArticleStatus.PENDIENTE]: 'warning'
    };
    return colors[status];
  };

  const getStatusLabel = (status: ArticleStatus) => {
    const labels: Record<ArticleStatus, string> = {
      [ArticleStatus.VALIDO]: 'Válido',
      [ArticleStatus.INVALIDO]: 'Inválido',
      [ArticleStatus.PENDIENTE]: 'Pendiente'
    };
    return labels[status];
  };

  const EditingHelper = () => (
    <Alert 
      severity="info" 
      variant="outlined"
      icon={false}
      sx={{ 
        mb: 2,
        borderRadius: 1,
        '& .MuiAlert-icon': {
          fontSize: '1.1rem'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EditIcon sx={{ fontSize: '1rem' }} />
        <Typography variant="body2">
          <strong>Tip:</strong> Haz click en los valores de <strong>Nombre</strong> o <strong>Monto</strong> para editarlos directamente
        </Typography>
      </Box>
    </Alert>
  );

  // Vista móvil con tarjetas
  if (isMobile) {
    return (
      <Paper elevation={2} sx={{ overflow: 'hidden' }} data-testid="virtualized-table">
        <EditingHelper />
        <Box
          ref={parentRef}
          sx={{
            height: '70vh',
            maxHeight: '600px',
            overflow: 'auto',
            width: '100%',
          }}
        >
          <Box
            sx={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const article = data[virtualItem.index];
              const articleWarnings = warnings.get(article.id) || [];
              
              return (
                <Box
                  key={virtualItem.key}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    p: 1,
                  }}
                >
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      height: 'calc(100% - 8px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        boxShadow: 2,
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" color="primary" fontWeight="bold">
                        #{article.id}
                      </Typography>
                      <WarningIndicator warnings={articleWarnings} />
                    </Box>
                    
                    <Box sx={{ display: 'grid', gap: 0.5, fontSize: '0.875rem' }}>
                      <Box><strong>Fecha:</strong> {formatDate(article.date)}</Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '24px' }}>
                        <strong>Nombre:</strong>
                        <Box sx={{ flex: 1 }}>
                          <EditableCell
                            value={article.name}
                            displayValue={decryptName(article.name)}
                            isEditing={editingCell?.id === article.id && editingCell?.field === 'name'}
                            onStartEdit={() => onStartEdit(article.id, 'name')}
                            onSave={onSaveEdit}
                            onCancel={onCancelEdit}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '24px' }}>
                        <strong>Monto:</strong>
                        <Box sx={{ flex: 1 }}>
                          <EditableCell
                            value={article.originalAmount}
                            displayValue={formatAmount(article.originalAmount)}
                            isEditing={editingCell?.id === article.id && editingCell?.field === 'originalAmount'}
                            onStartEdit={() => onStartEdit(article.id, 'originalAmount')}
                            onSave={onSaveEdit}
                            onCancel={onCancelEdit}
                            type="number"
                          />
                        </Box>
                      </Box>
                      
                      {article.amountUSD && (
                        <Box><strong>USD:</strong> {formatAmountUSD(article.amountUSD)}</Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {article.country} • {article.agentType}
                        </Typography>
                        <Chip
                          size="small"
                          label={getStatusLabel(article.status)}
                          color={getStatusColor(article.status)}
                          sx={{ height: '20px', fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>
    );
  }

  // Vista de escritorio - Sistema de grid personalizado
  return (
    <Paper data-testid="virtualized-table" elevation={2} sx={{ overflow: 'hidden', width: '100%' }}>
      <EditingHelper />
      <Box
        sx={{
          display: 'flex',
          backgroundColor: 'grey.50',
          borderBottom: '2px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          minHeight: '48px',
          alignItems: 'center',
        }}
      >
        {COLUMNS.map((column) => (
          <Box
            key={column.key}
            sx={{
              width: column.width,
              minWidth: column.width,
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderRight: 'none',
                flex: 1, // La última columna se expande
              }
            }}
          >
            {column.sortable ? (
              <TableSortLabel
                active={filters.sortBy === column.key}
                direction={filters.sortBy === column.key ? filters.sortOrder : 'asc'}
                onClick={() => onSort(column.key as 'date' | 'originalAmount')}
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  '& .MuiTableSortLabel-icon': {
                    fontSize: '1rem'
                  }
                }}
              >
                {column.label}
              </TableSortLabel>
            ) : (
              <Typography variant="subtitle2" fontWeight="bold">
                {column.label}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* Contenedor virtualizado */}
      <Box
        ref={parentRef}
        sx={{
          height: '70vh',
          maxHeight: '552px', // 600px - 48px del header
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Box
          sx={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const article = data[virtualItem.index];
            const articleWarnings = warnings.get(article.id) || [];
            
            return (
              <Box
                key={virtualItem.key}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: virtualItem.index % 2 === 0 ? 'background.paper' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                    cursor: 'pointer',
                  },
                  minHeight: '60px',
                }}
              >
                {/* ID */}
                <Box sx={{ 
                  width: COLUMNS[0].width,
                  minWidth: COLUMNS[0].width,
                  px: 2,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2" color="primary" fontWeight="medium">
                    {article.id}
                  </Typography>
                </Box>
                
                {/* Fecha */}
                <Box sx={{ 
                  width: COLUMNS[1].width,
                  minWidth: COLUMNS[1].width,
                  px: 2,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2">
                    {formatDate(article.date)}
                  </Typography>
                </Box>
                
                {/* Nombre */}
                <Box sx={{ 
                  width: COLUMNS[2].width,
                  minWidth: COLUMNS[2].width,
                  px: 2,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <EditableCell
                    value={article.name}
                    displayValue={decryptName(article.name)}
                    isEditing={editingCell?.id === article.id && editingCell?.field === 'name'}
                    onStartEdit={() => onStartEdit(article.id, 'name')}
                    onSave={onSaveEdit}
                    onCancel={onCancelEdit}
                  />
                </Box>
                
                {/* Monto */}
                <Box sx={{ 
                  width: COLUMNS[3].width,
                  minWidth: COLUMNS[3].width,
                  px: 2,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <EditableCell
                    value={article.originalAmount}
                    displayValue={formatAmount(article.originalAmount)}
                    isEditing={editingCell?.id === article.id && editingCell?.field === 'originalAmount'}
                    onStartEdit={() => onStartEdit(article.id, 'originalAmount')}
                    onSave={onSaveEdit}
                    onCancel={onCancelEdit}
                    type="number"
                  />
                </Box>
                
                {/* Monto USD */}
                <Box sx={{ 
                  width: COLUMNS[4].width,
                  minWidth: COLUMNS[4].width,
                  px: 2,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2">
                    {article.amountUSD ? formatAmountUSD(article.amountUSD) : '-'}
                  </Typography>
                </Box>
                
                {/* País */}
                <Box sx={{ 
                  width: COLUMNS[5].width,
                  minWidth: COLUMNS[5].width,
                  px: 2,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2" noWrap>
                    {article.country}
                  </Typography>
                </Box>
                
                {/* Agente/Tipo */}
                <Box sx={{ 
                  width: COLUMNS[6].width,
                  minWidth: COLUMNS[6].width,
                  px: 2,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2" noWrap>
                    {article.agentType}
                  </Typography>
                </Box>
                
                {/* Estado */}
                <Box sx={{ 
                  width: COLUMNS[7].width,
                  minWidth: COLUMNS[7].width,
                  px: 2,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Chip
                    size="small"
                    label={getStatusLabel(article.status)}
                    color={getStatusColor(article.status)}
                    sx={{ 
                      height: '24px',
                      fontSize: '0.75rem',
                      minWidth: 'auto'
                    }}
                  />
                </Box>
                
                {/* Alertas */}
                <Box sx={{ 
                  width: COLUMNS[8].width,
                  minWidth: COLUMNS[8].width,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1, // Se expande para ocupar el espacio restante
                }}>
                  <WarningIndicator warnings={articleWarnings} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}