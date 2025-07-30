import { useState, useEffect } from 'react';
import type { Article } from '../types';
import { ArticleStatus } from '../types';
import { ApiService, type BackendArticle } from '../services/apiService';

/**
 * Convierte un artículo del backend al formato del frontend
 */
function convertBackendArticle(backendArticle: BackendArticle): Article {
  return {
    id: backendArticle.id,
    date: new Date(backendArticle.fecha),
    name: backendArticle.nombreDesencriptado,
    originalAmount: backendArticle.montoOriginal,
    country: backendArticle.pais,
    agentType: backendArticle.agente,
    status: backendArticle.estadoCalculado as ArticleStatus,
    amountUSD: backendArticle.montoUSD
  };
}

/**
 * Hook personalizado para manejar los datos de artículos desde el backend
 */
export function useBackendData() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<boolean>(false);

  /**
   * Carga los artículos desde el backend
   */
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar estado del servidor primero
      const isServerUp = await ApiService.healthCheck();
      setServerStatus(isServerUp);
      
      if (!isServerUp) {
        throw new Error('El servidor backend no está disponible');
      }
      
      // Cargar artículos
      const backendArticles = await ApiService.getArticles();
      const convertedArticles = backendArticles.map(convertBackendArticle);
      
      setArticles(convertedArticles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading articles from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza un artículo en el backend y localmente
   */
  const updateArticle = async (id: string, field: 'name' | 'originalAmount', value: string | number) => {
    try {
      // Actualizar en el backend
      const updatedBackendArticle = await ApiService.updateArticle(id, field, value);
      
      // Actualizar el estado local con la respuesta del backend
      const updatedArticle = convertBackendArticle(updatedBackendArticle);
      
      setArticles(prev => prev.map(article => 
        article.id === id ? updatedArticle : article
      ));
      
    } catch (error) {
      console.error('Error updating article:', error);
      
      // En caso de error, mantener actualización local optimista
      setArticles(prev => prev.map(article => {
        if (article.id === id) {
          const updatedArticle = {
            ...article,
            [field]: field === 'originalAmount' ? parseFloat(String(value)) || 0 : String(value)
          };
          
          // Recalcular estado local básico (sin lógica completa del backend)
          if (field === 'originalAmount') {
            const amount = parseFloat(String(value)) || 0;
            if (amount <= 0) {
              updatedArticle.status = ArticleStatus.INVALIDO;
            } else if (updatedArticle.status === ArticleStatus.INVALIDO && amount > 0) {
              updatedArticle.status = ArticleStatus.VALIDO;
            }
          }
          
          return updatedArticle;
        }
        return article;
      }));
      
      // Podrías mostrar un mensaje de error al usuario aquí
      throw error;
    }
  };

  /**
   * Refresca los datos desde el servidor
   */
  const refreshData = () => {
    loadArticles();
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    serverStatus,
    updateArticle,
    refreshData,
    totalItems: articles.length
  };
}
