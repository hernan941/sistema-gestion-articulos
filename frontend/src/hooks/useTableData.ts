import { useState, useMemo, useCallback } from 'react';
import type { Article, TableFilters, EditableField } from '../types';
import { validateArticle } from '../utils/dataUtils';

export function useTableData(articles: Article[], onUpdateArticle?: (id: string, field: 'name' | 'originalAmount', value: string | number) => Promise<void>) {
  const [filters, setFilters] = useState<TableFilters>({
    search: '',
    status: '',
    sortBy: '',
    sortOrder: 'asc'
  });
  const [editingCell, setEditingCell] = useState<EditableField | null>(null);

  // Filtrar y ordenar los datos
  const filteredAndSortedData = useMemo(() => {
    let result = [...articles];

    // Aplicar búsqueda
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.country.toLowerCase().includes(searchTerm)
      );
    }

    // Aplicar filtro por estado
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      result.sort((a, b) => {
        let aValue: any = a[filters.sortBy as keyof Article];
        let bValue: any = b[filters.sortBy as keyof Article];

        if (filters.sortBy === 'date') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return filters.sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return filters.sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [articles, filters]);

  // Obtener advertencias para todos los elementos visibles
  const warnings = useMemo(() => {
    const warningsMap = new Map();
    filteredAndSortedData.forEach(article => {
      const articleWarnings = validateArticle(article);
      if (articleWarnings.length > 0) {
        warningsMap.set(article.id, articleWarnings);
      }
    });
    return warningsMap;
  }, [filteredAndSortedData]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<TableFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Manejar ordenamiento
  const handleSort = useCallback((field: 'date' | 'originalAmount') => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Iniciar edición de celda
  const startEditing = useCallback((id: string, field: 'name' | 'originalAmount') => {
    const article = articles.find((item: Article) => item.id === id);
    if (article) {
      setEditingCell({
        id,
        field,
        value: article[field]
      });
    }
  }, [articles]);

  // Cancelar edición
  const cancelEditing = useCallback(() => {
    setEditingCell(null);
  }, []);

  // Guardar edición
  const saveEdit = useCallback(async (newValue: string | number) => {
    if (!editingCell) return;

    try {
      // Usar el callback para actualizar el artículo si está disponible
      if (onUpdateArticle) {
        await onUpdateArticle(editingCell.id, editingCell.field, newValue);
      }

      setEditingCell(null);
    } catch (error) {
      console.error('Error saving edit:', error);
      // El error se maneja en useBackendData, aquí solo cerramos la edición
      setEditingCell(null);
    }
  }, [editingCell, onUpdateArticle]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      sortBy: '',
      sortOrder: 'asc'
    });
  }, []);

  return {
    data: filteredAndSortedData,
    filters,
    warnings,
    editingCell,
    updateFilters,
    handleSort,
    startEditing,
    cancelEditing,
    saveEdit,
    clearFilters,
    totalItems: articles.length,
    filteredItems: filteredAndSortedData.length
  };
}
