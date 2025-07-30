import { Tooltip, Box, IconButton } from '@mui/material';
import { Warning, Error } from '@mui/icons-material';
import type { ValidationWarning } from '../types';

interface WarningIndicatorProps {
  warnings: ValidationWarning[];
}

export function WarningIndicator({ warnings }: WarningIndicatorProps) {
  if (warnings.length === 0) return null;

  const hasError = warnings.some(w => w.severity === 'error');
  const hasWarning = warnings.some(w => w.severity === 'warning');

  const tooltipContent = warnings.map((warning, index) => (
    <div key={index} style={{ marginBottom: index < warnings.length - 1 ? '4px' : 0 }}>
      <strong>{warning.field}:</strong> {warning.message}
    </div>
  ));

  return (
    <Tooltip 
      title={<Box>{tooltipContent}</Box>} 
      arrow 
      placement="top"
    >
      <IconButton size="small" sx={{ padding: '2px' }}>
        {hasError ? (
          <Error color="error" fontSize="small" />
        ) : hasWarning ? (
          <Warning color="warning" fontSize="small" />
        ) : null}
      </IconButton>
    </Tooltip>
  );
}
