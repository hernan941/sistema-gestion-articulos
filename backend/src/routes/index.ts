import { Router } from 'express';
import { articlesController } from '../controllers/articlesController';

const router = Router();

/**
 * @route GET /articles
 * @desc Obtiene todos los artículos procesados
 * @access Public
 */
router.get('/articles', articlesController.getArticles.bind(articlesController));

/**
 * @route GET /articles/stats
 * @desc Obtiene estadísticas de los artículos
 * @access Public
 */
router.get('/articles/stats', articlesController.getArticleStats.bind(articlesController));

/**
 * @route PUT /articles/:id
 * @desc Actualiza un artículo específico
 * @access Public
 */
router.put('/articles/:id', articlesController.updateArticle.bind(articlesController));

/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', articlesController.healthCheck.bind(articlesController));

export default router;
