/**
 * Artículo tal como se almacena en el archivo JSON (con nombre encriptado)
 */
export interface RawArticle {
  id: string;
  fecha: string; // ISO string
  nombreEncriptado: string;
  montoOriginal: number;
  pais: string;
  agente: string;
}

/**
 * Artículo procesado que se retorna en la API
 */
export interface ProcessedArticle {
  id: string;
  fecha: string;
  nombreDesencriptado: string;
  montoOriginal: number;
  pais: string;
  agente: string;
  montoUSD: number;
  estadoCalculado: ArticleStatus;
}

/**
 * Estados posibles de un artículo
 */
export enum ArticleStatus {
  VALIDO = 'Válido',
  INVALIDO = 'Inválido',
  PENDIENTE = 'Pendiente'
}

/**
 * Estructura del archivo de tasas de cambio
 */
export interface ExchangeRates {
  [pais: string]: number;
}

/**
 * Respuesta de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

/**
 * Configuración de la aplicación
 */
export interface AppConfig {
  port: number;
  encryptionKey: string;
  nodeEnv: string;
  corsOrigins: string[];
}
