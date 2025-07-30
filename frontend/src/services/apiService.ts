/**
 * Tipos para la comunicación con el backend
 */
export interface BackendArticle {
  id: string;
  fecha: string;
  nombreDesencriptado: string;
  montoOriginal: number;
  pais: string;
  agente: string;
  montoUSD: number;
  estadoCalculado: 'Válido' | 'Inválido' | 'Pendiente';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

export interface ArticleStats {
  total: number;
  validos: number;
  invalidos: number;
  pendientes: number;
  excluidos: number;
}

/**
 * Configuración de la API
 */
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Servicio para comunicarse con el backend
 */
export class ApiService {
  /**
   * Obtiene todos los artículos desde el backend
   */
  static async getArticles(): Promise<BackendArticle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<BackendArticle[]> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Error obteniendo artículos');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw new Error('No se pudieron cargar los artículos del servidor');
    }
  }

  /**
   * Obtiene estadísticas de los artículos
   */
  static async getArticleStats(): Promise<ArticleStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<ArticleStats> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Error obteniendo estadísticas');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('No se pudieron cargar las estadísticas del servidor');
    }
  }

  /**
   * Actualiza un artículo específico
   */
  static async updateArticle(id: string, field: 'name' | 'originalAmount', value: string | number): Promise<BackendArticle> {
    try {
      // Mapear el campo del frontend al backend
      const backendField = field === 'name' ? 'nombreEncriptado' : 'montoOriginal';
      
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field: backendField,
          value: value
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<BackendArticle> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Error actualizando artículo');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error updating article:', error);
      throw new Error('No se pudo actualizar el artículo en el servidor');
    }
  }

  /**
   * Verifica el estado del servidor
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const result: ApiResponse<{ status: string; timestamp: string }> = await response.json();
      return result.success && result.data?.status === 'OK';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}
