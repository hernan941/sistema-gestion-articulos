import dotenv from 'dotenv';
import { AppConfig } from './types';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración de la aplicación obtenida de variables de entorno
 */
export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  encryptionKey: process.env.ENCRYPTION_KEY || 'mi_clave_secreta_de_32_caracteres',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173']
};

/**
 * Valida que la configuración sea correcta
 */
export function validateConfig(): void {
  // Ajustar la clave a exactamente 32 caracteres si es necesario
  if (config.encryptionKey.length > 32) {
    config.encryptionKey = config.encryptionKey.substring(0, 32);
  } else if (config.encryptionKey.length < 32) {
    // Pad con ceros si es muy corta
    config.encryptionKey = config.encryptionKey.padEnd(32, '0');
  }

  if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
    throw new Error('PORT debe ser un número válido entre 1 y 65535');
  }
}
