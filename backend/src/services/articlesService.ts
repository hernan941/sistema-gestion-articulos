import fs from 'fs';
import path from 'path';
import { RawArticle, ProcessedArticle, ArticleStatus, ExchangeRates } from '../types';
import { encryptionService } from './encryptionService';

/**
 * Servicio para manejar los artículos con toda la lógica de negocio
 */
export class ArticlesService {
  private articlesPath: string;
  private exchangeRatesPath: string;
  private exchangeRates: ExchangeRates | null = null;

  constructor() {
    this.articlesPath = path.join(__dirname, '../../data/articles.json');
    this.exchangeRatesPath = path.join(__dirname, '../../data/exchange_rates.json');
  }

  /**
   * Carga las tasas de cambio del archivo JSON
   */
  private async loadExchangeRates(): Promise<ExchangeRates> {
    if (this.exchangeRates) {
      return this.exchangeRates;
    }

    try {
      const data = await fs.promises.readFile(this.exchangeRatesPath, 'utf-8');
      this.exchangeRates = JSON.parse(data);
      return this.exchangeRates!;
    } catch (error) {
      console.error('Error loading exchange rates:', error);
      // Tasas por defecto si no se puede cargar el archivo
      this.exchangeRates = {
        'Argentina': 0.0028,
        'Brasil': 0.19,
        'Chile': 0.0012,
        'Colombia': 0.00024,
        'México': 0.056,
        'Perú': 0.27,
        'Uruguay': 0.026,
        'Ecuador': 1.0,
        'España': 1.1,
        'Estados Unidos': 1.0
      };
      return this.exchangeRates;
    }
  }

  /**
   * Carga los artículos del archivo JSON
   */
  private async loadRawArticles(): Promise<RawArticle[]> {
    try {
      const data = await fs.promises.readFile(this.articlesPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading articles:', error);
      throw new Error('No se pudieron cargar los artículos');
    }
  }

  /**
   * Aplica los filtros de exclusión según las reglas de negocio
   */
  private shouldExcludeArticle(article: RawArticle): boolean {
    const now = new Date();
    const articleDate = new Date(article.fecha);
    
    // Excluir artículos cuya fecha sea pasada y el agente sea "XYZ" y el país sea "Chile"
    return (
      articleDate < now && 
      article.agente === 'XYZ' && 
      article.pais === 'Chile'
    );
  }

  /**
   * Calcula el estado de un artículo según las reglas de negocio
   */
  private calculateStatus(article: RawArticle): ArticleStatus {
    const now = new Date();
    const articleDate = new Date(article.fecha);

    // Si el monto original es negativo o nulo, marcar como inválido
    if (article.montoOriginal <= 0) {
      return ArticleStatus.INVALIDO;
    }

    // Si la fecha es futura, marcar como pendiente
    if (articleDate > now) {
      return ArticleStatus.PENDIENTE;
    }

    // En cualquier otro caso, el estado será válido
    return ArticleStatus.VALIDO;
  }

  /**
   * Calcula el monto en USD usando las tasas de cambio
   */
  private async calculateUSDAmount(pais: string, montoOriginal: number): Promise<number> {
    const exchangeRates = await this.loadExchangeRates();
    const rate = exchangeRates[pais] || 1.0; // Tasa por defecto si no se encuentra el país
    return Math.round(montoOriginal * rate * 100) / 100; // Redondear a 2 decimales
  }

  /**
   * Procesa un artículo crudo aplicando toda la lógica de negocio
   */
  private async processArticle(rawArticle: RawArticle): Promise<ProcessedArticle> {
    const nombreDesencriptado = encryptionService.decrypt(rawArticle.nombreEncriptado);
    const estadoCalculado = this.calculateStatus(rawArticle);
    const montoUSD = await this.calculateUSDAmount(rawArticle.pais, rawArticle.montoOriginal);

    return {
      id: rawArticle.id,
      fecha: rawArticle.fecha,
      nombreDesencriptado,
      montoOriginal: rawArticle.montoOriginal,
      pais: rawArticle.pais,
      agente: rawArticle.agente,
      montoUSD,
      estadoCalculado
    };
  }

  /**
   * Obtiene todos los artículos procesados aplicando todas las reglas de negocio
   */
  async getProcessedArticles(): Promise<ProcessedArticle[]> {
    try {
      // Cargar artículos crudos
      const rawArticles = await this.loadRawArticles();
      
      // Filtrar artículos según reglas de exclusión
      const filteredArticles = rawArticles.filter(article => !this.shouldExcludeArticle(article));
      
      // Procesar cada artículo aplicando la lógica de negocio
      const processedArticles = await Promise.all(
        filteredArticles.map(article => this.processArticle(article))
      );

      return processedArticles;
    } catch (error) {
      console.error('Error processing articles:', error);
      throw error;
    }
  }

  /**
   * Actualiza un artículo específico en el archivo JSON
   */
  async updateArticle(id: string, field: string, value: string | number): Promise<ProcessedArticle | null> {
    try {
      // Cargar artículos actuales
      const rawArticles = await this.loadRawArticles();
      
      // Encontrar el artículo a actualizar
      const articleIndex = rawArticles.findIndex(article => article.id === id);
      if (articleIndex === -1) {
        return null;
      }

      const article = rawArticles[articleIndex];
      
      // Actualizar el campo correspondiente
      if (field === 'nombreEncriptado') {
        // Encriptar el nuevo nombre antes de guardarlo
        article.nombreEncriptado = encryptionService.encrypt(String(value));
      } else if (field === 'montoOriginal') {
        article.montoOriginal = Number(value);
      } else {
        throw new Error(`Campo no válido: ${field}`);
      }

      // Guardar el archivo actualizado
      await fs.promises.writeFile(
        this.articlesPath,
        JSON.stringify(rawArticles, null, 2),
        'utf-8'
      );

      // Procesar y retornar el artículo actualizado
      const processedArticle = await this.processArticle(article);
      
      return processedArticle;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de los artículos
   */
  async getArticleStats(): Promise<{
    total: number;
    validos: number;
    invalidos: number;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    pendientes: number;
    excluidos: number;
  }> {
    const rawArticles = await this.loadRawArticles();
    const excludedCount = rawArticles.filter(article => this.shouldExcludeArticle(article)).length;
    const processedArticles = await this.getProcessedArticles();

    const stats = processedArticles.reduce(
      (acc, article) => {
        switch (article.estadoCalculado) {
          case ArticleStatus.VALIDO:
            acc.validos++;
            break;
          case ArticleStatus.INVALIDO:
            acc.invalidos++;
            break;
          case ArticleStatus.PENDIENTE:
            acc.pendientes++;
            break;
        }
        return acc;
      },
      { total: processedArticles.length, validos: 0, invalidos: 0, pendientes: 0, excluidos: excludedCount }
    );

    return stats;
  }
}

// Instancia singleton
export const articlesService = new ArticlesService();
