import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { VirtualizedTable } from './components/VirtualizedTable';
import { TableControls } from './components/TableControls';
import { useTableData } from './hooks/useTableData';
import { useBackendData } from './hooks/useBackendData';

// Tema de Material-UI personalizado
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
        },
      },
    },
  },
});

function App() {
  // Usar el hook del backend para obtener los datos
  const {
    articles,
    loading,
    error,
    serverStatus,
    updateArticle,
    refreshData,
    totalItems
  } = useBackendData();
  
  const {
    data,
    filters,
    warnings,
    editingCell,
    updateFilters,
    handleSort,
    startEditing,
    cancelEditing,
    saveEdit,
    clearFilters,
    filteredItems
  } = useTableData(articles, updateArticle);

  // Mostrar loading mientras cargan los datos
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
            <CircularProgress size={60} />
            <Typography variant="h6">Cargando artículos desde el servidor...</Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  // Mostrar error si no se pueden cargar los datos
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
            <Alert severity="error" sx={{ maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>Error al cargar los datos</Typography>
              <Typography variant="body2" paragraph>{error}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Refresh />}
                  onClick={refreshData}
                >
                  Reintentar
                </Button>
              </Box>
            </Alert>
            {!serverStatus && (
              <Alert severity="warning" sx={{ maxWidth: 600 }}>
                <Typography variant="body2">
                  Asegúrate de que el servidor backend esté ejecutándose en http://localhost:3001
                </Typography>
              </Alert>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h3" component="h1">
              Tabla de Artículos
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={refreshData}
              disabled={loading}
            >
              Actualizar datos
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Tabla virtualizada conectada al backend con capacidad para manejar miles de elementos. 
            Los datos se obtienen del servidor con toda la lógica de negocio aplicada, incluyendo 
            desencriptación, validaciones y cálculos de montos en USD.
          </Typography>
          {!serverStatus && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Conectado al servidor backend en http://localhost:3001
            </Alert>
          )}
        </Box>

        <TableControls
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
          totalItems={totalItems}
          filteredItems={filteredItems}
        />

        <VirtualizedTable
          data={data}
          filters={filters}
          warnings={warnings}
          editingCell={editingCell}
          onSort={handleSort}
          onStartEdit={startEditing}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEditing}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
