import { Request, Response } from 'express';
import { articlesService } from '../services/articlesService';
import { ApiResponse, ProcessedArticle } from '../types';

/**
 * Controlador para los endpoints de artículos
 */
export class ArticlesController {
  
  /**
   * GET /articles - Obtiene todos los artículos procesados
   */
  async getArticles(req: Request, res: Response): Promise<void> {
    try {
      const articles = await articlesService.getProcessedArticles();
      
      const response: ApiResponse<ProcessedArticle[]> = {
        success: true,
        data: articles,
        count: articles.length,
        message: 'Artículos obtenidos exitosamente'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting articles:', error);
      
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error interno del servidor al obtener los artículos'
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /articles/stats - Obtiene estadísticas de los artículos
   */
  async getArticleStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await articlesService.getArticleStats();
      
      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
        message: 'Estadísticas obtenidas exitosamente'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting article stats:', error);
      
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error interno del servidor al obtener las estadísticas'
      };

      res.status(500).json(response);
    }
  }

  /**
   * PUT /articles/:id - Actualiza un artículo específico
   */
  async updateArticle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { field, value } = req.body;
      
      // Validar parámetros
      if (!id || !field || value === undefined) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Parámetros inválidos. Se requiere id, field y value'
        };
        res.status(400).json(response);
        return;
      }

      // Validar que el campo sea editable
      if (!['nombreEncriptado', 'montoOriginal'].includes(field)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Campo no editable. Solo se pueden editar nombreEncriptado y montoOriginal'
        };
        res.status(400).json(response);
        return;
      }

      const updatedArticle = await articlesService.updateArticle(id, field, value);
      
      if (!updatedArticle) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Artículo no encontrado'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<ProcessedArticle> = {
        success: true,
        data: updatedArticle,
        message: 'Artículo actualizado exitosamente'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error updating article:', error);
      
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error interno del servidor al actualizar el artículo'
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /health - Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    const response: ApiResponse<{ status: string; timestamp: string }> = {
      success: true,
      data: {
        status: 'OK',
        timestamp: new Date().toISOString()
      },
      message: 'Servicio funcionando correctamente'
    };

    res.status(200).json(response);
  }
}

// Instancia singleton
export const articlesController = new ArticlesController();
